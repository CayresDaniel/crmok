// src/evolution/clients.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ClientContact {
  id: string;
  name: string;
  phone: string;
  birthDate?: Date | null;
}

type ClientWithAppointments = {
  id: string;
  name: string;
  phone: string | null;
  birthDate: Date | null;
  appointments: {
    date: Date;
    status: string;
  }[];
};

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  // Buscar todos os clientes com telefone
  async getAllClientsWithPhone(): Promise<ClientContact[]> {
    try {
      console.log('📞 Buscando todos os clientes com telefone...');
      
      const clients = await this.prisma.client.findMany({
        where: {
          active: true,
          phone: {
            not: null
          },
          NOT: {
            phone: ''
          }
        },
        select: {
          id: true,
          name: true,
          phone: true,
          birthDate: true
        }
      });

      // Formatar números de telefone (remover caracteres especiais)
      const formattedClients = clients.map(client => ({
        ...client,
        phone: this.formatPhoneNumber(client.phone || '')
      })).filter(client => client.phone); // Remover números inválidos

      console.log(`✅ Encontrados ${formattedClients.length} clientes com telefone válido`);
      
      return formattedClients;
    } catch (error) {
      console.error('❌ Erro ao buscar clientes:', error);
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }
  }

  // Buscar aniversariantes do dia
  async getTodayBirthdayClients(): Promise<ClientContact[]> {
    try {
      console.log('🎂 Buscando aniversariantes do dia...');
      
      const today = new Date();
      const todayMonth = today.getMonth() + 1; // Janeiro = 1
      const todayDay = today.getDate();

      console.log(`📅 Buscando aniversariantes do dia ${todayDay}/${todayMonth}`);

      const clients = await this.prisma.client.findMany({
        where: {
          active: true,
          phone: {
            not: null
          },
          NOT: {
            phone: ''
          },
          birthDate: {
            not: null
          }
        },
        select: {
          id: true,
          name: true,
          phone: true,
          birthDate: true
        }
      });

      // Filtrar aniversariantes do dia
      const birthdayClients = clients.filter(client => {
        if (!client.birthDate) return false;
        
        const birthDate = new Date(client.birthDate);
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();
        
        return birthMonth === todayMonth && birthDay === todayDay;
      });

      // Formatar números de telefone
      const formattedClients = birthdayClients.map(client => ({
        ...client,
        phone: this.formatPhoneNumber(client.phone || '')
      })).filter(client => client.phone); // Remover números inválidos

      console.log(`🎉 Encontrados ${formattedClients.length} aniversariantes do dia`);
      
      return formattedClients;
    } catch (error) {
      console.error('❌ Erro ao buscar aniversariantes:', error);
      throw new Error(`Erro ao buscar aniversariantes: ${error.message}`);
    }
  }

  // Buscar telefones para envio em massa (somente os números)
  async getAllClientPhones(): Promise<string[]> {
    const clients = await this.getAllClientsWithPhone();
    return clients.map(client => client.phone);
  }

  // Buscar telefones dos aniversariantes (somente os números)
  async getTodayBirthdayPhones(): Promise<string[]> {
    const clients = await this.getTodayBirthdayClients();
    return clients.map(client => client.phone);
  }

  // Formatar número de telefone para WhatsApp
  private formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    
    // Remover todos os caracteres não numéricos
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Se começar com +55, remover
    if (cleanPhone.startsWith('55')) {
      cleanPhone = cleanPhone.substring(2);
    }
    
    // Verificar se é um número brasileiro válido
    if (cleanPhone.length === 11 && cleanPhone.startsWith('11')) {
      // São Paulo (11) com 9 dígitos
      return `55${cleanPhone}`;
    } else if (cleanPhone.length === 10 && cleanPhone.startsWith('11')) {
      // São Paulo (11) com 8 dígitos - adicionar 9
      return `5511${cleanPhone.substring(2)}`;
    } else if (cleanPhone.length === 11) {
      // Outros estados com 9 dígitos
      return `55${cleanPhone}`;
    } else if (cleanPhone.length === 10) {
      // Outros estados com 8 dígitos - adicionar 9
      const ddd = cleanPhone.substring(0, 2);
      const numero = cleanPhone.substring(2);
      return `55${ddd}9${numero}`;
    }
    
    // Se não conseguir formatar, retornar vazio (será filtrado)
    console.warn(`⚠️ Número de telefone inválido: ${phone}`);
    return '';
  }

  // Buscar clientes inativos (mais de 30 dias sem agendamento)
  async getInactiveClients(): Promise<ClientContact[]> {
    try {
      console.log('😴 Buscando clientes inativos (30+ dias sem agendamento)...');
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Buscar todos os clientes com telefone
      const allClients: ClientWithAppointments[] = await this.prisma.client.findMany({
        where: {
          active: true,
          phone: {
            not: null
          },
          NOT: {
            phone: ''
          }
        },
        select: {
          id: true,
          name: true,
          phone: true,
          birthDate: true,
          appointments: {
            select: {
              date: true,
              status: true
            },
            orderBy: {
              date: 'desc'
            },
            take: 1
          }
        }
      });

      // Filtrar clientes sem agendamento recente
      const inactiveClients = allClients.filter(client => {
        if (client.appointments.length === 0) {
          // Cliente nunca teve agendamento
          return true;
        }
        
        const lastAppointment = client.appointments[0];
        const lastAppointmentDate = new Date(lastAppointment.date);
        
        // Cliente com último agendamento há mais de 30 dias
        return lastAppointmentDate < thirtyDaysAgo;
      });

      // Formatar números de telefone
      const formattedClients = inactiveClients.map(client => ({
        id: client.id,
        name: client.name,
        phone: this.formatPhoneNumber(client.phone || ''),
        birthDate: client.birthDate,
        lastAppointment: client.appointments[0]?.date || null
      })).filter(client => client.phone);

      console.log(`😴 Encontrados ${formattedClients.length} clientes inativos`);
      
      return formattedClients;
    } catch (error) {
      console.error('❌ Erro ao buscar clientes inativos:', error);
      throw new Error(`Erro ao buscar clientes inativos: ${error.message}`);
    }
  }

  // Buscar telefones dos clientes inativos
  async getInactiveClientPhones(): Promise<string[]> {
    const clients = await this.getInactiveClients();
    return clients.map(client => client.phone);
  }

  // Criar novo agendamento para um cliente
  async scheduleFollowUp(clientId: string, appointmentDate: Date, userId: string) {
    try {
      console.log('📅 Criando reagendamento para cliente:', clientId);
      
      const startTime = new Date(appointmentDate);
      const endTime = new Date(appointmentDate);
      endTime.setHours(endTime.getHours() + 1); // 1 hora de duração padrão

      const appointment = await this.prisma.appointment.create({
        data: {
          clientId,
          userId,
          date: appointmentDate,
          startTime,
          endTime,
          status: 'AGENDADO',
          observations: 'Reagendamento automático (30 dias)'
        },
        include: {
          client: {
            select: {
              name: true
            }
          }
        }
      });

      console.log('✅ Reagendamento criado:', appointment);
      return appointment;
    } catch (error) {
      console.error('❌ Erro ao criar reagendamento:', error);
      throw new Error(`Erro ao criar reagendamento: ${error.message}`);
    }
  }

  // Obter estatísticas dos clientes
  async getClientsStats() {
    try {
      const totalClients = await this.prisma.client.count({
        where: { active: true }
      });

      const clientsWithPhone = await this.prisma.client.count({
        where: {
          active: true,
          phone: {
            not: null
          },
          NOT: {
            phone: ''
          }
        }
      });

      const todayBirthdays = await this.getTodayBirthdayClients();
      const inactiveClients = await this.getInactiveClients();

      return {
        totalClients,
        clientsWithPhone,
        todayBirthdays: todayBirthdays.length,
        inactiveClients: inactiveClients.length,
        availableForCampaign: clientsWithPhone,
        availableForBirthday: todayBirthdays.length,
        availableForReactivation: inactiveClients.length
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
  }
}