# Coven Beauty - CRM com WhatsApp

Sistema CRM para salão de beleza com integração WhatsApp para campanhas automáticas.

## 🚀 Funcionalidades

- ✅ **Gerenciamento de Clientes**: CRUD completo de clientes
- ✅ **Agendamentos**: Sistema completo de agendamentos com status
- ✅ **WhatsApp Integration**: Envio automático de mensagens via WhatsApp
- ✅ **Campanhas Automáticas**: 
  - Mensagens de aniversário (clientes do dia)
  - Campanhas para todos os clientes
  - Reativação de clientes inativos (30+ dias)
- ✅ **Reagendamento Automático**: Popup para reagendar após conclusão do atendimento
- ✅ **Dashboard**: Estatísticas e métricas do salão

## 🏗️ Arquitetura

### Backend (NestJS) - Porta 3009
- **Localização**: `./coven/`
- **Tecnologias**: NestJS, Prisma, MySQL
- **Responsabilidades**: API REST, gerenciamento de dados, lógica de negócio

### Frontend (Nuxt.js) - Porta 3010
- **Localização**: `./covenos-frontend/`
- **Tecnologias**: Nuxt.js, Vue 3, Tailwind CSS
- **Responsabilidades**: Interface do usuário, dashboard

### WhatsApp Service (Venom-Bot) - Porta 8080
- **Localização**: `./whatsapp-venom/`
- **Tecnologias**: Express.js, Venom-Bot
- **Responsabilidades**: Integração WhatsApp, envio de mensagens

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd newcoven
```

### 2. Instale as dependências

#### Backend
```bash
cd coven
npm install
```

#### Frontend
```bash
cd ../covenos-frontend
npm install
```

#### WhatsApp Service
```bash
cd ../whatsapp-venom
npm install
```

### 3. Configure o banco de dados

#### Crie o arquivo `.env` no backend:
```bash
cd coven
cp .env.example .env
```

#### Configure as variáveis no `.env`:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/coven"
NODE_ENV=development
```

#### Execute as migrações:
```bash
npx prisma migrate dev
npx prisma generate
```

## 🚀 Execução

### Desenvolvimento

#### 1. Inicie o WhatsApp Service:
```bash
cd whatsapp-venom
node server.js
```

#### 2. Inicie o Backend:
```bash
cd coven
npm run start:dev
```

#### 3. Inicie o Frontend:
```bash
cd covenos-frontend
npm run dev
```

### Produção

#### 1. Build do Backend:
```bash
cd coven
npm run build
```

#### 2. Build do Frontend:
```bash
cd covenos-frontend
npm run build
```

#### 3. Execute com PM2:
```bash
# WhatsApp Service
pm2 start whatsapp-venom/server.js --name "venom-bot"

# Backend
pm2 start coven/dist/main.js --name "backend"

# Frontend
pm2 start "npm run start" --cwd covenos-frontend --name "frontend"
```

## 🔧 Configuração WhatsApp

1. Acesse `http://localhost:8080/api/qrcode`
2. Escaneie o QR Code com o WhatsApp
3. Aguarde a conexão ser estabelecida
4. Teste os endpoints de envio

## 📱 Endpoints Principais

### WhatsApp API (porta 8080)
- `GET /api/status` - Status da conexão
- `GET /api/qrcode` - QR Code para conexão
- `POST /api/send-message` - Enviar mensagem individual
- `POST /api/send-bulk` - Enviar mensagens em massa

### Backend API (porta 3009)
- `GET /api/messages/clients/stats` - Estatísticas de clientes
- `GET /api/messages/clients/birthday-today` - Aniversariantes do dia
- `POST /api/messages/send-birthday-auto` - Enviar parabéns automático
- `POST /api/messages/send-campaign-auto` - Enviar campanha automática
- `POST /api/messages/send-reactivation-auto` - Enviar reativação automática
- `POST /api/messages/schedule-followup` - Reagendar cliente

## 🔒 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/coven"
NODE_ENV=production
```

### Frontend (.env)
```env
NUXT_PUBLIC_API_BASE=http://localhost:3009
```

## 📋 Requisitos do Sistema

- Node.js 18+
- MySQL 8.0+
- Chrome/Chromium (para Venom-Bot)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.



  DATABASE_URL="mysql://coven_user:JulianaDaniel@2409!@localhost:3306/coven"
  NODE_ENV=production
  PORT=3009

  cat > create-admin.js << 'EOF'
  const { PrismaClient } = require('@prisma/client');
  const bcrypt = require('bcrypt');

  async function createAdmin() {
    const prisma = new PrismaClient();

    try {
      const hashedPassword = await bcrypt.hash('@D4n63rl0l', 10);

      const user = await prisma.user.create({
        data: {
          username: 'cayres',
          name: 'Administrador',
          email: 'admin@covenos.com.br',
          password: hashedPassword,
          role: 'ADMIN',
          active: true
        }
      });

      console.log('✅ Usuário admin criado:', user);
    } catch (error) {
      console.error('❌ Erro:', error.message);
    } finally {
      await prisma.$disconnect();
    }
  }

  createAdmin();
  EOF

  INSERT INTO users (id, username, name, email, password, role, active, createdAt, updatedAt)     

  VALUES (
    UUID(),
    'cayres',
    'Administrador',
    'admin@covenos.com.br',
    '$2b$10$G5zqiU79YYuZOR1mji92GOUwnOqSms6Zfa41s2M9PMnx1zB09x..q',
    'ADMIN',
    1,
    NOW(),
    NOW()
  );

  $2b$10$G5zqiU79YYuZOR1mji92GOUwnOqSms6Zfa41s2M9PMnx1zB09x..q