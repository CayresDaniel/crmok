#!/bin/bash

echo "🚀 Aplicando correções de estabilidade no VPS..."

# 1. Parar todos os serviços
echo "⏹️ Parando serviços..."
pm2 stop all

# 2. Fazer backup dos logs atuais
echo "💾 Fazendo backup dos logs..."
mkdir -p /home/coven-beauty/logs-backup
cp -r /home/coven-beauty/logs/* /home/coven-beauty/logs-backup/ 2>/dev/null || true

# 3. Criar diretório de logs
echo "📁 Criando diretório de logs..."
mkdir -p /home/coven-beauty/logs

# 4. Fazer pull das mudanças
echo "📥 Baixando atualizações..."
cd /home/coven-beauty
git pull origin main

# 5. Reinstalar dependências do backend
echo "📦 Reinstalando dependências do backend..."
cd /home/coven-beauty/coven
npm ci --production

# 6. Rebuild do backend
echo "🔨 Fazendo build do backend..."
npm run build

# 7. Reinstalar dependências do frontend
echo "📦 Reinstalando dependências do frontend..."
cd /home/coven-beauty/covenos-frontend
npm ci --production

# 8. Rebuild do frontend
echo "🔨 Fazendo build do frontend..."
npm run build

# 9. Copiar novo ecosystem.config.js
echo "⚙️ Atualizando configuração PM2..."
cd /home/coven-beauty
cp ecosystem.config.js ecosystem.config.js.backup || true

# 10. Remover processos antigos do PM2
echo "🗑️ Removendo processos antigos..."
pm2 delete all 2>/dev/null || true

# 11. Iniciar com nova configuração
echo "🚀 Iniciando serviços com nova configuração..."
pm2 start ecosystem.config.js

# 12. Salvar configuração PM2
echo "💾 Salvando configuração PM2..."
pm2 save

# 13. Aguardar inicialização
echo "⏳ Aguardando inicialização dos serviços..."
sleep 10

# 14. Verificar status
echo "📊 Status dos serviços:"
pm2 status

# 15. Mostrar logs recentes
echo "📜 Logs recentes do backend:"
pm2 logs coven-backend --lines 10 --nostream

echo "✅ Deploy concluído! Monitorando estabilidade..."
echo "🔍 Para monitorar em tempo real: pm2 monit"
echo "📜 Para ver logs: pm2 logs"
echo "🔄 Para reiniciar um serviço: pm2 restart [nome]"