import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { FinancialService } from '../financial/financial.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment, AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private financialService: FinancialService,
  ) {}

  // REESTRUTURADO: Lógica de criação otimizada e mais clara
  async create(createAppointmentDto: CreateAppointmentDto) {
    const {
      procedureIds,
      startTime: startTimeString,
      date,
      userId,
      clientId,
    } = createAppointmentDto;

    // 1. Busca e valida os procedimentos
    const procedures = await this.prisma.procedure.findMany({
      where: { id: { in: procedureIds }, active: true },
    });
    if (procedures.length !== procedureIds.length) {
      throw new BadRequestException(
        'Um ou mais procedimentos são inválidos ou inativos.',
      );
    }

    // 2. Calcula duração, preço e horários
    const totalDuration = procedures.reduce(
      (sum, proc) => sum + proc.duration,
      0,
    );
    const totalPrice = procedures.reduce(
      (sum, proc) => sum + Number(proc.price),
      0,
    );
    const startTime = new Date(startTimeString);
    const endTime = new Date(startTime.getTime() + totalDuration * 60000);

    // 3. Valida conflito de horário
    await this.validateTimeConflict(userId, startTime, endTime);

    // 4. Cria o agendamento e seus procedimentos em uma transação
    return this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.create({
        data: {
          clientId: createAppointmentDto.clientId,
          userId: createAppointmentDto.userId,
          date: new Date(date),
          startTime,
          endTime,
          totalPrice,
          paymentMethod: createAppointmentDto.paymentMethod,
          discount: createAppointmentDto.discount,
          observations: createAppointmentDto.observations,
          procedures: {
            create: procedures.map((proc) => ({
              procedureId: proc.id,
              price: proc.price,
            })),
          },
        },
      });

      // Retorna o agendamento completo
      return tx.appointment.findUnique({
        where: { id: appointment.id },
        include: {
          client: true,
          user: true,
          procedures: { include: { procedure: true } },
        },
      });
    });
  }

  // REESTRUTURADO: Lógica de atualização totalmente unificada e corrigida
  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    // 1. Garante que o agendamento original exista
    const originalAppointment = await this.findOne(id);

    // 2. Determina os dados finais do agendamento (sejam novos ou existentes)
    const finalProcedureIds =
      updateAppointmentDto.procedureIds ||
      originalAppointment.procedures.map((p) => p.procedureId);

    const procedures = await this.prisma.procedure.findMany({
      where: { id: { in: finalProcedureIds }, active: true },
    });
    if (procedures.length !== finalProcedureIds.length) {
      throw new BadRequestException(
        'Um ou mais procedimentos são inválidos ou inativos.',
      );
    }

    const totalDuration = procedures.reduce(
      (sum, proc) => sum + proc.duration,
      0,
    );
    const finalTotalPrice = procedures.reduce(
      (sum, proc) => sum + Number(proc.price),
      0,
    );

    const finalStartTime = updateAppointmentDto.startTime
      ? new Date(updateAppointmentDto.startTime)
      : originalAppointment.startTime;
    const finalEndTime = new Date(
      finalStartTime.getTime() + totalDuration * 60000,
    );
    const finalUserId =
      updateAppointmentDto.userId || originalAppointment.userId;

    // 3. Valida conflito de horário com os dados finais, excluindo o próprio agendamento da checagem
    await this.validateTimeConflict(
      finalUserId,
      finalStartTime,
      finalEndTime,
      id,
    );

    // 4. Executa todas as atualizações em uma única transação
    return this.prisma.$transaction(async (tx) => {
      // Atualiza o agendamento principal com todos os dados novos ou existentes
      const updatedAppointment = await tx.appointment.update({
        where: { id },
        data: {
          clientId:
            updateAppointmentDto.clientId || originalAppointment.clientId,
          userId: finalUserId,
          date: updateAppointmentDto.date
            ? new Date(updateAppointmentDto.date)
            : originalAppointment.date,
          startTime: finalStartTime,
          endTime: finalEndTime,
          totalPrice: finalTotalPrice,
          paymentMethod:
            updateAppointmentDto.paymentMethod ||
            originalAppointment.paymentMethod,
          discount:
            updateAppointmentDto.discount !== undefined
              ? updateAppointmentDto.discount
              : originalAppointment.discount,
          observations:
            updateAppointmentDto.observations ||
            originalAppointment.observations,
        },
      });

      // Se os procedimentos mudaram, atualiza a tabela de junção
      if (updateAppointmentDto.procedureIds) {
        // Deleta os antigos
        await tx.appointmentProcedure.deleteMany({
          where: { appointmentId: id },
        });
        // Cria os novos
        await tx.appointmentProcedure.createMany({
          data: procedures.map((proc) => ({
            appointmentId: id,
            procedureId: proc.id,
            price: proc.price,
          })),
        });
      }

      // Retorna o agendamento completo e atualizado
      return tx.appointment.findUnique({
        where: { id },
        include: {
          client: true,
          user: true,
          procedures: { include: { procedure: true } },
        },
      });
    });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    const appointment = await this.findOne(id);
    if (status === 'CONCLUIDO' && appointment.status !== 'CONCLUIDO') {
      await this.consumeProducts(appointment);
      await this.createFinancialTransactionForAppointment(appointment);
    }
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }

  // NENHUMA MUDANÇA ABAIXO DESTA LINHA, MÉTODOS EXISTENTES MANTIDOS
  // ... (findAll, findOne, remove, checkAvailability, etc.)

  async findAll(startDate?: string, endDate?: string, userId?: string) {
    const where: any = {};
    if (startDate && endDate) {
      where.date = { gte: new Date(startDate), lte: new Date(endDate) };
    }
    if (userId) {
      where.userId = userId;
    }
    return this.prisma.appointment.findMany({
      where,
      include: {
        client: { select: { name: true, phone: true } },
        user: { select: { name: true } },
        procedures: {
          include: { procedure: { select: { name: true, duration: true } } },
        },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        user: { select: { id: true, name: true, email: true } },
        procedures: {
          include: {
            procedure: {
              include: { procedureProducts: { include: { product: true } } },
            },
          },
        },
      },
    });
    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    return appointment;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELADO' },
    });
  }

  async checkAvailability(
    userId: string,
    date: string,
    startTime: string,
    duration: number,
  ) {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    const conflicts = await this.prisma.appointment.findMany({
      where: {
        userId,
        date: new Date(date),
        status: { in: ['AGENDADO', 'EM_ANDAMENTO'] },
        OR: [
          { startTime: { lte: start }, endTime: { gt: start } },
          { startTime: { lt: end }, endTime: { gte: end } },
          { startTime: { gte: start }, endTime: { lte: end } },
        ],
      },
    });
    return conflicts.length === 0;
  }

  private async validateTimeConflict(
    userId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
  ) {
    const where: any = {
      userId,
      status: { in: ['AGENDADO', 'EM_ANDAMENTO'] },
      OR: [
        { startTime: { lte: startTime }, endTime: { gt: startTime } },
        { startTime: { lt: endTime }, endTime: { gte: endTime } },
        { startTime: { gte: startTime }, endTime: { lte: endTime } },
      ],
    };
    if (excludeAppointmentId) {
      where.NOT = { id: excludeAppointmentId };
    }
    const conflicts = await this.prisma.appointment.findMany({ where });
    if (conflicts.length > 0) {
      throw new ConflictException(
        'Conflito de horário detectado para este profissional.',
      );
    }
  }

  private async consumeProducts(appointment: any) {
    for (const ap of appointment.procedures) {
      for (const pp of ap.procedure.procedureProducts) {
        if (pp.product.type === 'USO_INTERNO') {
          await this.productsService.consumeProductForProcedure(
            pp.productId,
            pp.quantity,
            `Consumo - Agendamento ${appointment.id}`,
          );
        }
      }
    }
  }

  private async createFinancialTransactionForAppointment(appointment: any) {
    try {
      const procedureNames = appointment.procedures
        .map((ap) => ap.procedure.name)
        .join(', ');
      const description = `Receita de Agendamento - Cliente: ${appointment.client.name} (${procedureNames})`;
      await this.financialService.create({
        type: 'RECEITA',
        category: 'Serviços',
        description,
        amount: Number(appointment.totalPrice || 0),
        date: new Date().toISOString(),
        isPaid: true,
        recurrent: false,
      });
    } catch (error) {
      console.error(
        'Erro ao criar transação financeira para agendamento:',
        error,
      );
    }
  }
}
