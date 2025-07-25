#!/bin/bash

echo "🔧 Aplicando hotfix: Correção da validação de category nos DTOs..."

# 1. Ir para o diretório do projeto
cd /home/coven-beauty

# 2. Fazer pull da correção
echo "📥 Baixando correção do Git..."
git pull origin main

# 3. Ir para o backend
cd /home/coven-beauty/coven

# 4. Rebuild apenas do backend (mais rápido)
echo "🔨 Fazendo build do backend..."
npm run build

# 5. Restart apenas do backend
echo "🔄 Reiniciando backend..."
pm2 restart coven-backend

# 6. Aguardar reinicialização
echo "⏳ Aguardando reinicialização..."
sleep 5

# 7. Testar endpoint
echo "🧪 Testando endpoint de procedures..."
curl -s http://localhost:3009/api/health | head -1

echo ""
echo "✅ Hotfix aplicado!"
echo "🔧 Correção: Validação de campo category vazio nos DTOs"
echo "📝 Agora é possível criar procedures/products sem categoria"