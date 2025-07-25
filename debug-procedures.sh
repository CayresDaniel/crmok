#!/bin/bash

echo "🔍 DEBUG: Investigando erro 400 em procedures..."

# 1. Verificar se o backend está rodando
echo "1. Testando se backend está ativo:"
curl -s http://localhost:3009/api/health | head -1 || echo "❌ Backend não está respondendo"

# 2. Verificar logs recentes do backend
echo ""
echo "2. Logs recentes do backend (últimas 20 linhas):"
pm2 logs coven-backend --lines 20 --nostream 2>/dev/null || echo "❌ Não foi possível acessar logs do PM2"

# 3. Testar criação de procedure com payload simples
echo ""
echo "3. Testando criação de procedure com payload mínimo:"

# Obter token de login (se necessário, ajuste as credenciais)
TOKEN=$(curl -s -X POST http://localhost:3009/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Cayres","password":"@D4n63rl0l"}' | \
  grep -o '"access_token":"[^"]*"' | \
  cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Falha ao obter token de autenticação"
  echo "Tentando com usuário admin/123456..."
  TOKEN=$(curl -s -X POST http://localhost:3009/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"123456"}' | \
    grep -o '"access_token":"[^"]*"' | \
    cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo "❌ Não foi possível autenticar. Verifique credenciais."
  exit 1
fi

echo "✅ Token obtido: ${TOKEN:0:20}..."

# 4. Testar payload exato
echo ""
echo "4. Testando payload exato que está falhando:"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3009/api/procedures \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Teste Debug",
    "category": "OUTROS", 
    "description": "",
    "duration": 90,
    "price": 50,
    "active": true
  }')

echo "Resposta completa:"
echo "$RESPONSE"

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
echo ""
echo "Código HTTP: $HTTP_CODE"

# 5. Testar payload mínimo (sem campos opcionais)
echo ""
echo "5. Testando payload mínimo (apenas campos obrigatórios):"
curl -s -X POST http://localhost:3009/api/procedures \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Teste Mínimo",
    "duration": 60,
    "price": 30
  }'

echo ""
echo ""
echo "🔍 Debug concluído. Analise os logs acima para identificar o problema."