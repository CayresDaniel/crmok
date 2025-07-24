# 🚀 Guia de Deploy na VPS - Coven Beauty CRM

## Pré-requisitos na VPS

### 1. Instalar Node.js 18+
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 2. Instalar MySQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# Configurar MySQL
sudo mysql_secure_installation

# Criar banco de dados
sudo mysql -u root -p
CREATE DATABASE coven;
CREATE USER 'coven_user'@'localhost' IDENTIFIED BY 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON coven.* TO 'coven_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Instalar PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 4. Instalar Nginx (Proxy Reverso)
```bash
# Ubuntu/Debian
sudo apt install nginx

# Iniciar e habilitar
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Deploy da Aplicação

### 1. Clonar o Repositório
```bash
cd /home
git clone <URL-DO-SEU-REPOSITORIO> coven-beauty
cd coven-beauty
```

### 2. Configurar Backend (NestJS)

#### Instalar dependências:
```bash
cd coven
npm install
```

#### Configurar variáveis de ambiente:
```bash
cp .env.example .env
nano .env
```

Edite o .env com:
```env
DATABASE_URL="mysql://coven_user:senha_forte_aqui@localhost:3306/coven"
NODE_ENV=production
PORT=3009
```

#### Executar migrações do banco:
```bash
npx prisma migrate deploy
npx prisma generate
```

#### Build da aplicação:
```bash
npm run build
```

### 3. Configurar WhatsApp Service (Venom-Bot)

#### Instalar dependências:
```bash
cd ../whatsapp-venom
npm install
```

### 4. Configurar Frontend (Nuxt.js)

#### Instalar dependências:
```bash
cd ../covenos-frontend
npm install
```

#### Configurar variáveis de ambiente:
```bash
cp .env.example .env
nano .env
```

Edite o .env com:
```env
NUXT_PUBLIC_API_BASE=http://SEU-DOMINIO.com/api
NUXT_PORT=3000
```

#### Build da aplicação:
```bash
npm run build
```

## Configuração PM2

### 1. Criar arquivo de configuração PM2
```bash
cd /home/coven-beauty
nano ecosystem.config.js
```

Adicione o conteúdo:
```javascript
module.exports = {
  apps: [
    {
      name: 'coven-backend',
      script: './coven/dist/main.js',
      cwd: '/home/coven-beauty',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3009
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend.log'
    },
    {
      name: 'coven-whatsapp',
      script: './whatsapp-venom/server.js',
      cwd: '/home/coven-beauty',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './logs/whatsapp-error.log',
      out_file: './logs/whatsapp-out.log',
      log_file: './logs/whatsapp.log'
    },
    {
      name: 'coven-frontend',
      script: 'npm',
      args: 'run start',
      cwd: '/home/coven-beauty/covenos-frontend',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend.log'
    }
  ]
};
```

### 2. Criar diretório de logs
```bash
mkdir logs
```

### 3. Iniciar aplicações com PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Configuração Nginx

### 1. Criar configuração do site
```bash
sudo nano /etc/nginx/sites-available/coven-beauty
```

Adicione o conteúdo:
```nginx
server {
    listen 80;
    server_name SEU-DOMINIO.com www.SEU-DOMINIO.com;

    # Frontend (Nuxt.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (NestJS)
    location /api/ {
        proxy_pass http://localhost:3009/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WhatsApp Service (Venom-Bot)
    location /whatsapp/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Logs
    access_log /var/log/nginx/coven-beauty.access.log;
    error_log /var/log/nginx/coven-beauty.error.log;
}
```

### 2. Habilitar site
```bash
sudo ln -s /etc/nginx/sites-available/coven-beauty /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL/HTTPS com Certbot (Opcional mas Recomendado)

### 1. Instalar Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

### 2. Obter certificado SSL
```bash
sudo certbot --nginx -d SEU-DOMINIO.com -d www.SEU-DOMINIO.com
```

## Comandos Úteis de Monitoramento

### PM2
```bash
# Ver status das aplicações
pm2 status

# Ver logs
pm2 logs

# Reiniciar aplicação específica
pm2 restart coven-backend

# Reiniciar todas
pm2 restart all

# Parar aplicação
pm2 stop coven-backend

# Deletar aplicação
pm2 delete coven-backend
```

### Nginx
```bash
# Testar configuração
sudo nginx -t

# Recarregar configuração
sudo systemctl reload nginx

# Verificar status
sudo systemctl status nginx

# Ver logs
sudo tail -f /var/log/nginx/error.log
```

### MySQL
```bash
# Conectar ao banco
mysql -u coven_user -p coven

# Ver processos
sudo systemctl status mysql

# Reiniciar MySQL
sudo systemctl restart mysql
```

## Configuração do WhatsApp

### 1. Acessar QR Code
```bash
# Acesse no navegador:
http://SEU-DOMINIO.com/whatsapp/api/qrcode
```

### 2. Escanear com WhatsApp
- Abra o WhatsApp no celular
- Va em "Dispositivos conectados"
- Escaneie o QR Code

## Backup Automático (Opcional)

### 1. Criar script de backup
```bash
nano /home/backup-coven.sh
```

Conteúdo:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u coven_user -p'senha_forte_aqui' coven > /home/backups/coven_$DATE.sql
find /home/backups -name "coven_*.sql" -mtime +7 -delete
```

### 2. Dar permissão e agendar
```bash
chmod +x /home/backup-coven.sh
mkdir /home/backups

# Adicionar ao crontab (backup diário às 2h)
crontab -e
# Adicionar linha:
0 2 * * * /home/backup-coven.sh
```

## Troubleshooting

### Problemas Comuns:

1. **Erro de conexão com banco**: Verificar credenciais no .env
2. **WhatsApp não conecta**: Verificar se o Chrome está instalado na VPS
3. **Frontend não carrega**: Verificar se build foi feito corretamente
4. **Erro 502 no Nginx**: Verificar se os serviços estão rodando (pm2 status)

### Logs importantes:
```bash
# Logs PM2
pm2 logs

# Logs Nginx
sudo tail -f /var/log/nginx/error.log

# Logs do sistema
sudo journalctl -f
```

## Segurança Adicional

### 1. Firewall
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
```

### 2. Atualizar sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Configurar usuário específico (opcional)
```bash
sudo adduser coven
sudo usermod -aG sudo coven
# Deploy com este usuário em vez de root
```

---

🎉 **Aplicação rodando!** Acesse: http://SEU-DOMINIO.com