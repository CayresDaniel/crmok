#!/bin/bash

echo "🔒 Configurando SSL/HTTPS para covenos.com.br..."

# 1. Verificar se o domínio está apontando corretamente
echo "🌐 Verificando DNS..."
nslookup covenos.com.br

# 2. Instalar Certbot se não estiver instalado
echo "📦 Instalando Certbot..."
apt update
apt install certbot python3-certbot-nginx -y

# 3. Parar nginx temporariamente para renovar certificados
echo "⏹️ Parando nginx..."
systemctl stop nginx

# 4. Obter certificado SSL
echo "🔐 Obtendo certificado SSL..."
certbot certonly --standalone -d covenos.com.br --email admin@covenos.com.br --agree-tos --non-interactive

# 5. Atualizar configuração do Nginx com SSL
echo "⚙️ Configurando Nginx com SSL..."
cat > /etc/nginx/sites-available/coven-beauty << 'EOF'
server {
    listen 80;
    server_name covenos.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name covenos.com.br;

    ssl_certificate /etc/letsencrypt/live/covenos.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/covenos.com.br/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Frontend (Nuxt.js)
    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3009/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # WhatsApp API
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
        proxy_read_timeout 86400;
    }
}
EOF

# 6. Verificar configuração
echo "✅ Verificando configuração do Nginx..."
nginx -t

# 7. Iniciar nginx
echo "🚀 Iniciando Nginx..."
systemctl start nginx
systemctl reload nginx

# 8. Configurar renovação automática
echo "🔄 Configurando renovação automática..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# 9. Atualizar variável de ambiente do frontend
echo "⚙️ Atualizando .env do frontend..."
cd /home/coven-beauty/covenos-frontend
echo "NUXT_PUBLIC_API_BASE=https://covenos.com.br/api" > .env

# 10. Rebuild do frontend com nova configuração
echo "🔨 Fazendo rebuild do frontend..."
npm run build

# 11. Reiniciar frontend
echo "🔄 Reiniciando frontend..."
pm2 restart coven-frontend

echo "✅ SSL configurado com sucesso!"
echo "🌐 Site disponível em: https://covenos.com.br"
echo "🔒 Certificado válido por 90 dias (renovação automática configurada)"