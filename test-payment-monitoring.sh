#!/bin/bash

echo "🧪 Testando Monitoramento de Pagamento"
echo "======================================"
echo ""

# 1. Criar pagamento
echo "1️⃣ Criando pagamento..."
ORDER_ID="test-monitor-$(date +%s)"

PAYMENT=$(curl -s -X POST http://localhost:3000/api/payments/create \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 10.50,
    \"orderId\": \"$ORDER_ID\",
    \"paymentMethod\": \"pix\",
    \"email\": \"teste@teste.com\",
    \"description\": \"Teste Monitoramento\"
  }")

PAYMENT_ID=$(echo "$PAYMENT" | grep -o '"payment_id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$PAYMENT_ID" ]; then
  echo "❌ Falha ao criar pagamento"
  exit 1
fi

echo "✅ Pagamento criado: $PAYMENT_ID"
echo ""

# 2. Testar consulta de status
echo "2️⃣ Testando consulta de status..."

STATUS=$(curl -s "http://localhost:3000/api/payments/status?preference_id=$PAYMENT_ID")

echo "Resposta: $STATUS"
echo ""

if echo "$STATUS" | grep -q '"success":true'; then
  echo "✅ API de status funcionando!"
  echo ""
  echo "📋 Como funciona:"
  echo "   1. Cliente clica em 'Pagar com Mercado Pago'"
  echo "   2. Abre checkout externo"
  echo "   3. Sistema verifica status a cada 5 segundos"
  echo "   4. Quando aprovado, detecta automaticamente"
  echo "   5. Atualiza pedido no Firebase"
  echo "   6. Modal fecha e confirma pagamento"
else
  echo "⚠️ API retornou erro"
fi
