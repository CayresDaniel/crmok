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
        productUsages: {
          include: {
            product: true,
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
        status: { in: ['AGENDADO', 'CONFIRMADO'] },
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
      status: { in: ['AGENDADO', 'CONFIRMADO'] },
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
    // NOTA: Consumo automático de produtos foi desabilitado
    // Agora os produtos são consumidos manualmente através do sistema de comandas
    // A tabela ProcedureProduct agora serve apenas para vincular produtos disponíveis
    // aos procedimentos, sem quantidade específica
    console.log(`ℹ️  Produtos para agendamento ${appointment.id} devem ser consumidos via sistema de comandas`);
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

  // ===== FUNCIONALIDADES DE COMANDA =====

  async confirmAppointment(id: string) {
    const appointment = await this.findOne(id);
    
    if (appointment.status !== 'AGENDADO') {
      throw new BadRequestException('Apenas agendamentos com status AGENDADO podem ser confirmados');
    }

    // Registra 50% do valor como receita parcial no financeiro
    const partialPayment = Number(appointment.totalPrice) * 0.5;
    
    await this.prisma.$transaction(async (tx) => {
      // Atualiza o status para CONFIRMADO
      await tx.appointment.update({
        where: { id },
        data: { 
          status: 'CONFIRMADO',
          partialPayment: partialPayment
        },
      });

      // Cria transação financeira para o pagamento parcial
      await this.financialService.create({
        type: 'RECEITA',
        category: 'Serviços - Entrada',
        description: `Entrada (50%) - ${appointment.client.name} - Agendamento ${id.substring(0, 8)}`,
        amount: partialPayment,
        date: new Date().toISOString(),
        isPaid: true,
        recurrent: false,
      });
    });

    return this.findOne(id);
  }

  async openComanda(id: string) {
    const appointment = await this.findOne(id);
    
    if (appointment.status !== 'CONFIRMADO') {
      throw new BadRequestException('Apenas agendamentos confirmados podem ter a comanda aberta');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { 
        status: 'CONFIRMADO',
        comandaOpenedAt: new Date()
      },
      include: {
        client: true,
        user: true,
        procedures: { include: { procedure: true } },
        productUsages: { include: { product: true } }
      }
    });
  }

  async addProductToComanda(appointmentId: string, productId: string, quantity: number) {
    const appointment = await this.findOne(appointmentId);
    
    if (!['AGENDADO', 'CONFIRMADO'].includes(appointment.status)) {
      throw new BadRequestException('Apenas agendamentos ativos podem receber produtos');
    }

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Calcula custo baseado no tipo de produto
    let quantityToUse = quantity;
    let unitCost = 0;
    
    if (product.type === 'USO_INTERNO' && product.unitQuantity) {
      // Para produtos por medida, verifica o estoque considerando o que já foi usado
      const existingUsages = await this.prisma.productUsage.findMany({
        where: { productId }
      });
      const totalUsed = existingUsages.reduce((sum, usage) => sum + Number(usage.quantityUsed), 0);
      const totalCapacity = product.stock * Number(product.unitQuantity);
      const remainingAvailable = totalCapacity - totalUsed;
      
      if (quantity > remainingAvailable) {
        if (remainingAvailable <= 0) {
          throw new BadRequestException(`Produto esgotado. Necessário repor estoque. Total em ${product.stock} ${product.unit} já foi usado completamente.`);
        } else {
          throw new BadRequestException(`Estoque insuficiente. Disponível: ${remainingAvailable}${product.unitMeasurement} de ${totalCapacity}${product.unitMeasurement} total`);
        }
      }
      
      if (product.price) {
        // Custo por unidade de medida (ex: por ml)
        unitCost = Number(product.price) / Number(product.unitQuantity);
      }
    } else {
      // Para produtos de uso interno ou venda direta
      if (quantity > product.stock) {
        throw new BadRequestException(`Estoque insuficiente. Disponível: ${product.stock} ${product.unit || 'un'}`);
      }
      
      if (product.price) {
        unitCost = Number(product.price);
      }
    }

    const totalCost = unitCost * quantity;

    // Registra o uso do produto
    const productUsage = await this.prisma.productUsage.create({
      data: {
        appointmentId,
        productId,
        quantityUsed: quantity,
        unitCost,
        totalCost: product.addToCost ? totalCost : 0, // Só calcula custo se marcado
      }
    });

    // Atualiza o estoque
    if (product.type === 'USO_INTERNO' && product.unitQuantity) {
      // Para produtos por medida, não alteramos o stock aqui
      // O stock representa quantas unidades físicas temos
      // A quantidade usada é controlada pelo ProductUsage
      // O stock só deve ser alterado quando:
      // 1. Comprar/adicionar produtos (manual via interface)
      // 2. Corrigir inventário
      // 3. Produto danificado/vencido
      console.log(`✓ Registrado uso de ${quantity}${product.unitMeasurement} de ${product.name}`);
    } else {
      // Para produtos unitários, reduz normalmente
      await this.prisma.product.update({
        where: { id: productId },
        data: { stock: Math.max(0, product.stock - quantity) }
      });
    }

    return productUsage;
  }

  async addProcedureToComanda(appointmentId: string, procedureId: string, customPrice?: number) {
    const appointment = await this.findOne(appointmentId);
    
    if (appointment.status !== 'CONFIRMADO') {
      throw new BadRequestException('Apenas agendamentos confirmados podem receber procedimentos adicionais');
    }

    const procedure = await this.prisma.procedure.findUnique({ where: { id: procedureId } });
    if (!procedure) {
      throw new NotFoundException('Procedimento não encontrado');
    }

    // Verifica se o procedimento já existe no agendamento
    const existingProcedure = await this.prisma.appointmentProcedure.findUnique({
      where: {
        appointmentId_procedureId: {
          appointmentId,
          procedureId
        }
      }
    });

    if (existingProcedure) {
      throw new BadRequestException('Procedimento já adicionado ao agendamento');
    }

    // Adiciona o procedimento ao agendamento
    const finalPrice = customPrice !== undefined ? customPrice : Number(procedure.price);
    
    return this.prisma.$transaction(async (tx) => {
      // Cria a relação do procedimento
      const appointmentProcedure = await tx.appointmentProcedure.create({
        data: {
          appointmentId,
          procedureId,
          price: finalPrice
        }
      });

      // Atualiza o preço total do agendamento
      const currentAppointment = await tx.appointment.findUnique({ where: { id: appointmentId } });
      if (!currentAppointment) {
        throw new Error('Appointment not found');
      }
      const newTotalPrice = Number(currentAppointment.totalPrice || 0) + finalPrice;
      
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { totalPrice: newTotalPrice }
      });

      return appointmentProcedure;
    });
  }

  async finishComanda(appointmentId: string, finishData: {
    paymentMethod: string;
    discount?: number;
    finalPrice?: number;
  }) {
    const appointment = await this.findOne(appointmentId);
    
    if (appointment.status !== 'CONFIRMADO') {
      throw new BadRequestException('Apenas agendamentos confirmados podem ser finalizados');
    }

    // Busca os produtos utilizados
    const productUsages = await this.prisma.productUsage.findMany({
      where: { appointmentId },
      include: { product: true }
    });

    // Calcula taxas de cartão
    let cardTax = 0;
    let finalPrice = finishData.finalPrice || Number(appointment.totalPrice);
    
    if (finishData.discount) {
      finalPrice -= finishData.discount;
    }

    // Aplica taxas de cartão
    switch (finishData.paymentMethod) {
      case 'CARTAO_DEBITO':
        cardTax = 0.0279; // 2.79%
        break;
      case 'CARTAO_CREDITO_1X':
        cardTax = 0.0599; // 5.99%
        break;
      case 'CARTAO_CREDITO_2X':
        cardTax = 0.1139; // 11.39%
        break;
      case 'CARTAO_CREDITO_3X':
        cardTax = 0.1249; // 12.49%
        break;
      case 'CARTAO_CREDITO_ACIMA_3X':
        // Taxa repassada ao cliente, não desconta
        cardTax = 0;
        break;
      default:
        cardTax = 0;
    }

    const taxAmount = finalPrice * cardTax;
    const finalAmountAfterTax = finalPrice - taxAmount;

    return this.prisma.$transaction(async (tx) => {
      // Atualiza o agendamento
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: 'CONCLUIDO',
          paymentMethod: finishData.paymentMethod as any,
          discount: finishData.discount,
          finalPrice: finalAmountAfterTax,
          cardTax,
          comandaClosedAt: new Date(),
          paymentData: JSON.stringify({
            originalPrice: Number(appointment.totalPrice),
            discount: finishData.discount || 0,
            priceBeforeTax: finalPrice,
            taxRate: cardTax,
            taxAmount,
            finalAmount: finalAmountAfterTax
          })
        }
      });

      // Registra receita final no financeiro (descontando a entrada já paga)
      const remainingAmount = finalAmountAfterTax - (Number(appointment.partialPayment) || 0);
      
      if (remainingAmount > 0) {
        await this.financialService.create({
          type: 'RECEITA',
          category: 'Serviços - Finalização',
          description: `Finalização - ${appointment.client.name} - Agendamento ${appointmentId.substring(0, 8)}`,
          amount: remainingAmount,
          date: new Date().toISOString(),
          isPaid: true,
          recurrent: false,
        });
      }

      // Registra custos dos produtos (apenas os marcados como custo)
      const totalProductCosts = productUsages
        .filter(usage => usage.product.addToCost)
        .reduce((sum, usage) => sum + Number(usage.totalCost || 0), 0);

      if (totalProductCosts > 0) {
        const productDescriptions = productUsages
          .filter(usage => usage.product.addToCost)
          .map(usage => `${usage.product.name}: ${usage.quantityUsed}${usage.product.unitMeasurement || usage.product.unit || 'un'}`)
          .join(', ');

        await this.financialService.create({
          type: 'DESPESA',
          category: 'Custos Operacionais',
          description: `Custos de produtos - ${appointment.client.name} - ${productDescriptions}`,
          amount: totalProductCosts,
          date: new Date().toISOString(),
          isPaid: true,
          recurrent: false,
        });
      }

      return updatedAppointment;
    });
  }
}
