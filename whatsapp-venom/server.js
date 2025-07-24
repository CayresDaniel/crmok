const express = require('express');
const venom = require('venom-bot');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Variáveis globais
let client = null;
let qrCode = null;
let isConnected = false;

// Função para inicializar o Venom
async function initVenom() {
  try {
    console.log('🚀 Iniciando Venom-Bot...');
    
    client = await venom.create(
      'CRM-WhatsApp', // Nome da sessão
      (base64Qr, asciiQR) => {
        // QR Code gerado
        console.log('📱 QR Code gerado!');
        qrCode = base64Qr;
      },
      (statusSession) => {
        console.log('📊 Status da sessão:', statusSession);
        if (statusSession === 'inChat') {
          isConnected = true;
          console.log('✅ WhatsApp conectado com sucesso!');
        }
      },
      {
        multiDevice: true,
        folderNameToken: 'tokens',
        headless: true,
        devtools: false,
        debug: false,
        logQR: true,
        browserArgs: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    );

    console.log('🎉 Cliente Venom iniciado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao iniciar Venom:', error);
  }
}

// Rotas da API

// Obter QR Code
app.get('/api/qrcode', (req, res) => {
  if (qrCode) {
    res.json({
      success: true,
      qrcode: qrCode,
      message: 'QR Code disponível'
    });
  } else if (isConnected) {
    res.json({
      success: false,
      message: 'WhatsApp já está conectado'
    });
  } else {
    res.json({
      success: false,
      message: 'QR Code ainda não foi gerado. Aguarde...'
    });
  }
});

// Verificar status da conexão
app.get('/api/status', async (req, res) => {
  try {
    if (client && isConnected) {
      const connectionState = await client.getConnectionState();
      res.json({
        success: true,
        connected: isConnected,
        state: connectionState,
        message: 'WhatsApp conectado'
      });
    } else {
      res.json({
        success: false,
        connected: false,
        message: 'WhatsApp não está conectado'
      });
    }
  } catch (error) {
    res.json({
      success: false,
      connected: false,
      message: 'Erro ao verificar status',
      error: error.message
    });
  }
});

// Conectar (iniciar processo)
app.post('/api/connect', async (req, res) => {
  try {
    if (!client) {
      // Se não existe cliente, inicializar
      initVenom();
      res.json({
        success: true,
        message: 'Processo de conexão iniciado. Aguarde o QR Code.'
      });
    } else if (isConnected) {
      res.json({
        success: true,
        message: 'WhatsApp já está conectado'
      });
    } else {
      res.json({
        success: true,
        message: 'Aguardando conexão. Escaneie o QR Code.'
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: 'Erro ao conectar',
      error: error.message
    });
  }
});

// Enviar mensagem
app.post('/api/send-message', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    if (!client || !isConnected) {
      return res.json({
        success: false,
        message: 'WhatsApp não está conectado'
      });
    }
    
    if (!phone || !message) {
      return res.json({
        success: false,
        message: 'Telefone e mensagem são obrigatórios'
      });
    }
    
    // Formatear número (adicionar @c.us se necessário)
    const formattedPhone = phone.includes('@c.us') ? phone : `${phone}@c.us`;
    
    const result = await client.sendText(formattedPhone, message);
    
    console.log(`✅ Mensagem enviada para ${phone}: ${message}`);
    
    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      result: result
    });
    
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error);
    res.json({
      success: false,
      message: 'Erro ao enviar mensagem',
      error: error.message
    });
  }
});

// Enviar mensagem para múltiplos contatos
app.post('/api/send-bulk', async (req, res) => {
  try {
    const { contacts, message } = req.body;
    
    if (!client || !isConnected) {
      return res.json({
        success: false,
        message: 'WhatsApp não está conectado'
      });
    }
    
    if (!contacts || !Array.isArray(contacts) || !message) {
      return res.json({
        success: false,
        message: 'Lista de contatos e mensagem são obrigatórios'
      });
    }
    
    const results = [];
    
    for (const contact of contacts) {
      try {
        const formattedPhone = contact.includes('@c.us') ? contact : `${contact}@c.us`;
        const result = await client.sendText(formattedPhone, message);
        
        results.push({
          contact,
          success: true,
          result
        });
        
        console.log(`✅ Mensagem enviada para ${contact}: ${message}`);
        
        // Delay entre mensagens para evitar bloqueio
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        results.push({
          contact,
          success: false,
          error: error.message
        });
        console.error(`❌ Erro ao enviar para ${contact}:`, error.message);
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    
    res.json({
      success: true,
      message: `${successCount}/${contacts.length} mensagens enviadas`,
      results
    });
    
  } catch (error) {
    console.error('❌ Erro no envio em massa:', error);
    res.json({
      success: false,
      message: 'Erro no envio em massa',
      error: error.message
    });
  }
});

// Desconectar
app.post('/api/disconnect', async (req, res) => {
  try {
    if (client) {
      await client.close();
      client = null;
      qrCode = null;
      isConnected = false;
      
      console.log('🔌 WhatsApp desconectado');
      
      res.json({
        success: true,
        message: 'WhatsApp desconectado com sucesso'
      });
    } else {
      res.json({
        success: false,
        message: 'Nenhuma conexão ativa encontrada'
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: 'Erro ao desconectar',
      error: error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌐 Servidor Venom-Bot rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
  
  // Iniciar Venom automaticamente
  setTimeout(() => {
    initVenom();
  }, 2000);
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Promise rejeitada:', error);
});