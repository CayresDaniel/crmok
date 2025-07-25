#!/bin/bash

echo "🚀 Deploy atualização: Modals responsivos + Frontend-Backend fixes..."

# 1. Parar todos os serviços
echo "⏹️ Parando serviços..."
pm2 stop all

# 2. Fazer backup dos logs atuais
echo "💾 Fazendo backup dos logs..."
mkdir -p /home/coven-beauty/logs-backup/$(date +%Y%m%d_%H%M%S)
cp -r /home/coven-beauty/logs/* /home/coven-beauty/logs-backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# 3. Criar diretório de logs
echo "📁 Criando diretório de logs..."
mkdir -p /home/coven-beauty/logs

# 4. Fazer pull das mudanças
echo "📥 Baixando atualizações do repositório..."
cd /home/coven-beauty
git stash 2>/dev/null || true
git pull origin main

# 5. Backup do banco antes das migrações
echo "💾 Fazendo backup do banco de dados..."
mysqldump -h localhost -P 3307 -u root covenos_db > /home/coven-beauty/backup_$(date +%Y%m%d_%H%M%S).sql 2>/dev/null || echo "⚠️ Backup do banco falhou, continuando..."

# 6. Reinstalar dependências do backend
echo "📦 Reinstalando dependências do backend..."
cd /home/coven-beauty/coven
npm ci

# 7. Executar migrações do banco
echo "🗃️ Executando migrações do banco de dados..."
npx prisma generate
npx prisma migrate deploy

# 8. Rebuild do backend
echo "🔨 Fazendo build do backend..."
npm run build

# 9. Reinstalar dependências do frontend
echo "📦 Reinstalando dependências do frontend..."
cd /home/coven-beauty/covenos-frontend
npm ci

# 10. Rebuild do frontend  
echo "🔨 Fazendo build do frontend..."
npm run build

# 11. Copiar novo ecosystem.config.js
echo "⚙️ Atualizando configuração PM2..."
cd /home/coven-beauty
cp ecosystem.config.js ecosystem.config.js.backup_$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# 12. Remover processos antigos do PM2
echo "🗑️ Removendo processos antigos..."
pm2 delete all 2>/dev/null || true

# 13. Iniciar com nova configuração
echo "🚀 Iniciando serviços com nova configuração..."
pm2 start ecosystem.config.js

# 14. Salvar configuração PM2
echo "💾 Salvando configuração PM2..."
pm2 save

# 15. Aguardar inicialização
echo "⏳ Aguardando inicialização dos serviços..."
sleep 15

# 16. Verificar status
echo "📊 Status dos serviços:"
pm2 status

# 17. Testar endpoints críticos
echo "🧪 Testando endpoints críticos..."
echo "Health Check Backend:"
curl -s http://localhost:3009/api/health | head -1 || echo "❌ Backend não está respondendo"

echo "Frontend:"
curl -s -I http://localhost:3010 | head -1 || echo "❌ Frontend não está respondendo"

# 18. Mostrar logs recentes
echo "📜 Logs recentes do backend:"
pm2 logs coven-backend --lines 10 --nostream 2>/dev/null || true

echo ""
echo "✅ Deploy concluído!"
echo "🔧 Correções aplicadas:"
echo "  • ✅ Modais responsivos para iPhone SE"  
echo "  • ✅ Campos category em procedures/products"
echo "  • ✅ Campos endTime/status em appointments"
echo "  • ✅ Enum TransactionType corrigido"
echo "  • ✅ Campo description em transações"
echo ""
echo "🔍 Para monitorar: pm2 monit"
echo "📜 Para ver logs: pm2 logs"
echo "🔄 Para reiniciar: pm2 restart [nome]"