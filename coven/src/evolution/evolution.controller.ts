// src/evolution/evolution.controller.ts (no seu backend NestJS)
import { Controller, Post, Body, Get } from '@nestjs/common';
import { EvolutionApiService } from './evolution.service';
import { ClientsService } from './clients.service';
import { 
  SendBirthdayMessageDto, 
  SendCampaignMessageDto, 
  MessageResult 
} from './evolution.types';

@Controller('messages')
export class EvolutionController {
  constructor(
    private readonly evolutionService: EvolutionApiService,
    private readonly clientsService: ClientsService
  ) {}

  // ADICIONE ESTA ROTA QUE ESTAVA FALTANDO
  @Get('status')
  async getStatus() {
    return await this.evolutionService.getInstanceStatus();
  }

  @Post('create-instance')
  async createInstance() {
    try {
      return await this.evolutionService.createInstance();
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao criar instância',
        error: error.message
      };
    }
  }

  @Post('connect')
  async connect() {
    try {
      return await this.evolutionService.connectInstance();
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar instância',
        error: error.message
      };
    }
  }

  @Get('qrcode')
  async getQRCode() {
    try {
      return await this.evolutionService.getQRCode();
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao obter QR Code',
        error: error.message
      };
    }
  }

  @Get('connection-state')
  async getConnectionState() {
    try {
      return await this.evolutionService.getConnectionState();
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao verificar estado de conexão',
        error: error.message,
        state: 'close'
      };
    }
  }

  @Post('send-birthday')
  async sendBirthdayMessage(@Body() data: SendBirthdayMessageDto) {
    try {
      const results = await this.evolutionService.sendBulkMessage(
        data.contacts,
        data.message
      );
      
      return {
        success: true,
        message: 'Mensagens de aniversário enviadas',
        results
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao enviar mensagens de aniversário',
        results: [],
        error: error.message
      };
    }
  }

  @Post('send-campaign')
  async sendCampaignMessage(@Body() data: SendCampaignMessageDto) {
    try {
      const results = await this.evolutionService.sendBulkMessage(
        data.contacts,
        data.message
      );
      
      return {
        success: true,
        message: 'Mensagens de campanha enviadas',
        results
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao enviar mensagens de campanha',
        results: [],
        error: error.message
      };
    }
  }

  // NOVOS ENDPOINTS PARA BUSCAR CLIENTES

  @Get('clients/all')
  async getAllClients() {
    try {
      const clients = await this.clientsService.getAllClientsWithPhone();
      return {
        success: true,
        message: `${clients.length} clientes encontrados`,
        data: clients
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao buscar clientes',
        error: error.message,
        data: []
      };
    }
  }

  @Get('clients/phones')
  async getAllClientPhones() {
    try {
      const phones = await this.clientsService.getAllClientPhones();
      return {
        success: true,
        message: `${phones.length} telefones encontrados`,
        data: phones
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao buscar telefones',
        error: error.message,
        data: []
      };
    }
  }

  @Get('clients/birthday-today')
  async getTodayBirthdayClients() {
    try {
      const clients = await this.clientsService.getTodayBirthdayClients();
      return {
        success: true,
        message: `${clients.length} aniversariantes encontrados`,
        data: clients
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao buscar aniversariantes',
        error: error.message,
        data: []
      };
    }
  }

  @Get('clients/birthday-phones')
  async getTodayBirthdayPhones() {
    try {
      const phones = await this.clientsService.getTodayBirthdayPhones();
      return {
        success: true,
        message: `${phones.length} telefones de aniversariantes encontrados`,
        data: phones
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao buscar telefones de aniversariantes',
        error: error.message,
        data: []
      };
    }
  }

  @Get('clients/stats')
  async getClientsStats() {
    try {
      const stats = await this.clientsService.getClientsStats();
      return {
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao obter estatísticas',
        error: error.message,
        data: {}
      };
    }
  }

  // ENDPOINTS MELHORADOS PARA ENVIOS AUTOMÁTICOS

  @Post('send-campaign-auto')
  async sendCampaignToAllClients(@Body() data: { message: string }) {
    try {
      console.log('📨 Iniciando campanha para todos os clientes...');
      
      // Buscar telefones automaticamente
      const phones = await this.clientsService.getAllClientPhones();
      
      if (phones.length === 0) {
        return {
          success: false,
          message: 'Nenhum cliente com telefone encontrado',
          results: []
        };
      }

      console.log(`📱 Enviando para ${phones.length} clientes...`);
      
      const results = await this.evolutionService.sendBulkMessage(
        phones,
        data.message
      );
      
      return {
        success: true,
        message: `Campanha enviada para ${phones.length} clientes`,
        results,
        totalSent: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao enviar campanha automática',
        results: [],
        error: error.message
      };
    }
  }

  @Post('send-birthday-auto')
  async sendBirthdayToTodayClients(@Body() data: { message: string }) {
    try {
      console.log('🎂 Iniciando envio para aniversariantes do dia...');
      
      // Buscar telefones dos aniversariantes automaticamente
      const clients = await this.clientsService.getTodayBirthdayClients();
      
      if (clients.length === 0) {
        return {
          success: false,
          message: 'Nenhum aniversariante encontrado hoje',
          results: []
        };
      }

      const phones = clients.map(client => client.phone);
      
      console.log(`🎉 Enviando para ${clients.length} aniversariantes...`);
      console.log('Aniversariantes:', clients.map(c => `${c.name} (${c.phone})`));
      
      const results = await this.evolutionService.sendBulkMessage(
        phones,
        data.message
      );
      
      return {
        success: true,
        message: `Mensagens de aniversário enviadas para ${clients.length} clientes`,
        results,
        clients: clients.map(c => ({ name: c.name, phone: c.phone })),
        totalSent: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao enviar mensagens de aniversário automáticas',
        results: [],
        error: error.message
      };
    }
  }

  // NOVOS ENDPOINTS PARA CLIENTES INATIVOS E REAGENDAMENTO

  @Get('clients/inactive')
  async getInactiveClients() {
    try {
      const clients = await this.clientsService.getInactiveClients();
      return {
        success: true,
        message: `${clients.length} clientes inativos encontrados`,
        data: clients
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao buscar clientes inativos',
        error: error.message,
        data: []
      };
    }
  }

  @Get('clients/inactive-phones')
  async getInactiveClientPhones() {
    try {
      const phones = await this.clientsService.getInactiveClientPhones();
      return {
        success: true,
        message: `${phones.length} telefones de clientes inativos encontrados`,
        data: phones
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao buscar telefones de clientes inativos',
        error: error.message,
        data: []
      };
    }
  }

  @Post('send-reactivation-auto')
  async sendReactivationToInactiveClients(@Body() data: { message: string }) {
    try {
      console.log('😴 Iniciando envio para clientes inativos...');
      
      // Buscar telefones dos clientes inativos automaticamente
      const clients = await this.clientsService.getInactiveClients();
      
      if (clients.length === 0) {
        return {
          success: false,
          message: 'Nenhum cliente inativo encontrado',
          results: []
        };
      }

      const phones = clients.map(client => client.phone);
      
      console.log(`😴 Enviando para ${clients.length} clientes inativos...`);
      console.log('Clientes inativos:', clients.map(c => `${c.name} (${c.phone})`));
      
      const results = await this.evolutionService.sendBulkMessage(
        phones,
        data.message
      );
      
      return {
        success: true,
        message: `Mensagens de reativação enviadas para ${clients.length} clientes`,
        results,
        clients: clients.map(c => ({ name: c.name, phone: c.phone })),
        totalSent: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao enviar mensagens de reativação automáticas',
        results: [],
        error: error.message
      };
    }
  }

  @Post('schedule-followup')
  async scheduleFollowUp(@Body() data: { clientId: string; appointmentDate: string; userId: string }) {
    try {
      console.log('📅 Reagendando cliente...');
      
      const appointment = await this.clientsService.scheduleFollowUp(
        data.clientId,
        new Date(data.appointmentDate),
        data.userId
      );
      
      return {
        success: true,
        message: 'Reagendamento criado com sucesso',
        data: appointment
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao criar reagendamento',
        error: error.message
      };
    }
  }
}