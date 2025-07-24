// src/evolution/evolution.service.ts - Atualizado para Venom-Bot
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MessageResult } from './evolution.types';

@Injectable()
export class EvolutionApiService {
  private readonly baseUrl = 'http://localhost:8080'; // Venom-Bot na porta 8080
  // Venom-Bot não precisa de API key nem instance name

  constructor(private readonly httpService: HttpService) {}

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  // Verificar status da conexão - Venom-Bot
  async getInstanceStatus() {
    try {
      console.log('🔍 Verificando status da conexão Venom...');
      
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/api/status`,
          { 
            headers: this.getHeaders(),
            timeout: 10000
          }
        )
      );
      
      console.log('✅ Status da conexão obtido:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: 'Status verificado com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao verificar status:', error.response?.data || error.message);
      
      return {
        success: false,
        message: `Erro ao verificar status: ${error.response?.status} - ${error.response?.statusText || error.message}`,
        error: error.message,
        data: { connected: false }
      };
    }
  }

  // Conectar WhatsApp - Venom-Bot
  async createInstance() {
    try {
      console.log('🔧 Iniciando conexão Venom-Bot...');
      
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/api/connect`,
          {},
          { 
            headers: this.getHeaders(),
            timeout: 15000
          }
        )
      );
      
      console.log('✅ Conexão iniciada:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: 'Conexão iniciada com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao iniciar conexão:', error.response?.data || error.message);
      
      return {
        success: false,
        message: `Erro ao iniciar conexão: ${error.response?.data?.message || error.message}`,
        error: error.message
      };
    }
  }

  // Conectar e obter QR Code - Venom-Bot
  async connectInstance() {
    try {
      console.log('🔗 Obtendo QR Code do Venom-Bot...');
      
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/api/qrcode`,
          { 
            headers: this.getHeaders(),
            timeout: 15000
          }
        )
      );
      
      console.log('✅ QR Code obtido:', response.data);
      
      return {
        success: true,
        data: response.data,
        qrcode: response.data.qrcode,
        message: 'QR Code obtido com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao obter QR Code:', error.response?.data || error.message);
      
      return {
        success: false,
        message: `Erro ao obter QR Code: ${error.response?.data?.message || error.message}`,
        error: error.message
      };
    }
  }

  // Enviar mensagem - Venom-Bot
  async sendMessage(phoneNumber: string, message: string) {
    try {
      console.log('📱 Enviando mensagem para:', phoneNumber);
      
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/api/send-message`,
          {
            phone: phoneNumber,
            message: message
          },
          { 
            headers: this.getHeaders(),
            timeout: 30000
          }
        )
      );
      
      console.log('✅ Mensagem enviada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error.response?.data || error.message);
      throw new Error(`Erro ao enviar mensagem: ${error.response?.data?.message || error.message}`);
    }
  }

  // Obter QR Code - Venom-Bot
  async getQRCode() {
    try {
      console.log('📱 Obtendo QR Code...');
      
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/api/qrcode`,
          { 
            headers: this.getHeaders(),
            timeout: 15000
          }
        )
      );
      
      console.log('✅ QR Code obtido:', response.data);
      
      return {
        success: true,
        data: response.data,
        qrcode: response.data.qrcode,
        message: 'QR Code obtido com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao obter QR Code:', error.response?.data || error.message);
      
      return {
        success: false,
        message: `Erro ao obter QR Code: ${error.response?.data?.message || error.message}`,
        error: error.message
      };
    }
  }

  // Verificar status de conexão - Venom-Bot
  async getConnectionState() {
    try {
      console.log('🔍 Verificando estado de conexão...');
      
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/api/status`,
          { 
            headers: this.getHeaders(),
            timeout: 10000
          }
        )
      );
      
      console.log('✅ Estado de conexão obtido:', response.data);
      
      return {
        success: true,
        data: response.data,
        state: response.data.connected ? 'open' : 'close',
        message: 'Estado de conexão verificado'
      };
    } catch (error) {
      console.error('❌ Erro ao verificar estado:', error.response?.data || error.message);
      
      return {
        success: false,
        message: `Erro ao verificar estado: ${error.response?.data?.message || error.message}`,
        error: error.message,
        state: 'close'
      };
    }
  }

  // Enviar mensagem para múltiplos contatos - Venom-Bot
  async sendBulkMessage(contacts: string[], message: string): Promise<MessageResult[]> {
    try {
      console.log(`📨 Enviando mensagem para ${contacts.length} contatos via Venom-Bot...`);
      
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/api/send-bulk`,
          {
            contacts: contacts,
            message: message
          },
          { 
            headers: this.getHeaders(),
            timeout: 60000 // 1 minuto para envios em massa
          }
        )
      );
      
      console.log('✅ Envio em massa concluído:', response.data);
      
      // Converter resposta do Venom para formato esperado pelo frontend
      const results: MessageResult[] = response.data.results.map((result: any) => ({
        contact: result.contact,
        success: result.success,
        result: result.success ? result.result : undefined,
        error: result.success ? undefined : result.error
      }));
      
      return results;
      
    } catch (error) {
      console.error('❌ Erro no envio em massa:', error.response?.data || error.message);
      
      // Fallback: enviar uma por uma se o bulk falhar
      const results: MessageResult[] = [];
      
      for (const contact of contacts) {
        try {
          const result = await this.sendMessage(contact, message);
          results.push({ 
            contact, 
            success: true, 
            result 
          });
          console.log(`✅ Mensagem enviada para ${contact}`);
        } catch (error) {
          results.push({ 
            contact, 
            success: false, 
            error: error.message 
          });
          console.log(`❌ Falha ao enviar para ${contact}:`, error.message);
        }
        
        // Delay entre mensagens para evitar bloqueio
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      console.log(`📊 Resumo: ${results.filter(r => r.success).length}/${results.length} mensagens enviadas com sucesso`);
      
      return results;
    }
  }
}