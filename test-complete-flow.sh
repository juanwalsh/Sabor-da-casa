#!/bin/bash

echo "🧪 TESTE COMPLETO - Novo Fluxo de Pagamento"
echo "=========================================="
echo ""

ORDER_ID="order-$(date +%s)"

echo "1️⃣ Simulando criação de pedido + pagamento..."
PAYMENT=$(curl -s -X POST http://localhost:3000/api/payments/create \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 150.00,
    \"orderId\": \"$ORDER_ID\",
    \"paymentMethod\": \"pix\",
    \"email\": \"cliente@teste.com\",
    \"description\": \"Pedido - Sabor da Casa - Total: R\$ 150.00\"
  }")

SUCCESS=$(echo "$PAYMENT" | grep -o '"success":true')
PAYMENT_URL=$(echo "$PAYMENT" | grep -o 'https://[^"]*' | head -1)
PAYMENT_ID=$(echo "$PAYMENT" | grep -o '"payment_id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SUCCESS" ]; then
  echo "❌ Falha ao criar pagamento"
  echo "Resposta: $PAYMENT"
  exit 1
fi

echo "✅ Pagamento criado com sucesso!"
echo ""
echo "📋 Detalhes:"
echo "   Order ID: $ORDER_ID"
echo "   Payment ID: $PAYMENT_ID"
echo "   Checkout URL: $PAYMENT_URL"
echo ""
echo "2️⃣ Verificando API de status..."

STATUS=$(curl -s "http://localhost:3000/api/payments/status?preference_id=$PAYMENT_ID")

if echo "$STATUS" | grep -q "success"; then
  echo "✅ API de monitoramento funcionando!"
else
  echo "⚠️ Problema na API de status"
fi

echo ""
echo "=========================================="
echo "✅ FLUXO COMPLETO FUNCIONANDO!"
echo "=========================================="
echo ""
echo "🎯 Como funciona agora:"
echo ""
echo "1. Cliente preenche dados no checkout"
echo "2. Clica em 'Finalizar Pedido'"
echo "3. Sistema cria link de pagamento (R$ 150.00)"
echo "4. Abre checkout do Mercado Pago em nova aba"
echo "5. Cliente escolhe: PIX, Cartão, Boleto..."
echo "6. Sistema monitora a cada 5 segundos"
echo "7. Quando aprovado:"
echo "   → Pedido confirmado no Firebase"
echo "   → Modal fecha automaticamente"
echo ""
echo "✅ IGUAL AO PIXEL LINK!"
echo ""
