import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ClientsService } from '../clients/clients.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class RemindersService {
  constructor(
    private prisma: PrismaService,
    private clientsService: ClientsService,
    private productsService: ProductsService,
  ) {}

  async create(createReminderDto: CreateReminderDto) {
    return this.prisma.reminder.create({
      data: createReminderDto,
    });
  }

  async findAll(filters?: {
    startDate?: string;
    endDate?: string;
    status?: 'active' | 'inactive' | 'all';
    type?: string;
    clientId?: string;
  }) {
    const where: any = {};

    // Filtro de status
    if (!filters?.status || filters.status === 'active') {
      where.isActive = true;
    } else if (filters.status === 'inactive') {
      where.isActive = false;
    }
    // Para 'all', não adiciona filtro de isActive

    // Filtro de data
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    // Filtro de tipo
    if (filters?.type) {
      where.type = filters.type;
    }

    // Filtro de cliente
    if (filters?.clientId) {
      where.clientId = filters.clientId;
    }

    return this.prisma.reminder.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        client: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getActiveReminders() {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [manualReminders, birthdayClients, lowStockProducts] =
      await Promise.all([
        this.prisma.reminder.findMany({
          where: {
            isActive: true,
            type: { in: ['MANUAL', 'AGENDAMENTO'] },
            date: { lte: nextWeek },
          },
          include: {
            user: { select: { name: true } },
            client: { select: { name: true } },
          },
          orderBy: { date: 'asc' },
        }),
        this.clientsService.getBirthdaysThisMonth(),
        this.productsService.getLowStockProducts(),
      ]);

    const birthdayReminders = birthdayClients.map((client) => ({
      id: `birthday-${client.id}`,
      type: 'ANIVERSARIO',
      title: `Aniversário de ${client.name}`,
      description: `${client.name} faz aniversário hoje!`,
      date: client.birthDate || new Date(),
      client,
    }));

    const stockReminders = lowStockProducts.map((product) => ({
      id: `stock-${product.id}`,
      type: 'PRODUTO_BAIXO',
      title: `Estoque baixo: ${product.name}`,
      description: `${product.name} está com estoque de ${product.stock} ${product.unit}`,
      date: today,
      product,
    }));

    return {
      manual: manualReminders,
      birthdays: birthdayReminders,
      lowStock: stockReminders,
      total:
        manualReminders.length +
        birthdayReminders.length +
        stockReminders.length,
    };
  }

  async findOne(id: string) {
    const reminder = await this.prisma.reminder.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } },
        client: { select: { name: true } },
      },
    });

    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado');
    }

    return reminder;
  }

  async update(id: string, updateReminderDto: UpdateReminderDto) {
    await this.findOne(id);

    return this.prisma.reminder.update({
      where: { id },
      data: updateReminderDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.reminder.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async markAsComplete(id: string) {
    await this.findOne(id);

    return this.prisma.reminder.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async createBirthdayReminders() {
    const clients = await this.clientsService.getBirthdaysThisMonth();
    const reminders: any[] = [];

    for (const client of clients) {
      if (client.birthDate) {
        const existingReminder = await this.prisma.reminder.findFirst({
          where: {
            type: 'ANIVERSARIO',
            clientId: client.id,
            date: client.birthDate,
            isActive: true,
          },
        });

        if (!existingReminder) {
          const reminder = await this.create({
            type: 'ANIVERSARIO',
            title: `Aniversário de ${client.name}`,
            description: `Enviar felicitações e cupom de desconto`,
            date: client.birthDate.toISOString(),
            clientId: client.id,
          });
          reminders.push(reminder);
        }
      }
    }

    return reminders;
  }

  async checkDailyBirthdays() {
    const today = new Date();
    const clients = await this.prisma.client.findMany({
      where: {
        active: true,
        birthDate: {
          not: null,
        },
      },
    });

    const reminders: any[] = [];

    for (const client of clients) {
      if (client.birthDate) {
        const birthDate = new Date(client.birthDate);

        // Verifica se é aniversário hoje (mesmo mês e dia)
        if (
          birthDate.getMonth() === today.getMonth() &&
          birthDate.getDate() === today.getDate()
        ) {
          // Verifica se já existe lembrete para hoje
          const existingReminder = await this.prisma.reminder.findFirst({
            where: {
              type: 'ANIVERSARIO',
              clientId: client.id,
              isActive: true,
              date: {
                gte: new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                ),
                lt: new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() + 1,
                ),
              },
            },
          });

          if (!existingReminder) {
            // Cria lembrete para hoje
            const reminderDate = new Date(today);
            reminderDate.setHours(9, 0, 0, 0); // 9:00 da manhã

            const reminder = await this.create({
              type: 'ANIVERSARIO',
              title: `🎉 Aniversário de ${client.name}`,
              description: `Hoje é aniversário de ${client.name}! Enviar felicitações e oferecer desconto especial.`,
              date: reminderDate.toISOString(),
              clientId: client.id,
            });
            reminders.push(reminder);
          }
        }
      }
    }

    console.log(
      `🎂 Verificação diária: ${reminders.length} lembretes de aniversário criados`,
    );
    return reminders;
  }
}
