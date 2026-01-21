#!/bin/bash

echo "🧪 Testando Fluxo Completo de Pagamento"
echo "========================================"
echo""

# 1. Criar um pedido no Firebase
ORDER_ID="test-order-$(date +%s)"
echo "1️⃣ Criando pedido: $ORDER_ID"

curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d "{
    \"orderId\": \"$ORDER_ID\",
    \"customerName\": \"Cliente Teste\",
    \"phone\": \"(11) 99999-9999\",
    \"address\": \"Rua Teste, 123\",
    \"total\": 45.50,
    \"items\": [
      {
        \"product\": {
          \"id\": \"1\",
          \"name\": \"Pizza Margherita\",
          \"price\": 35.00
        },
        \"quantity\": 1
      }
    ]
  }" > /dev/null

if [ $? -eq 0 ]; then
  echo "✅ Pedido criado com sucesso"
else
  echo "❌ Falha ao criar pedido"
  exit 1
fi

echo ""
echo "2️⃣ Criando pagamento PIX..."

PAYMENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/payments/create \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 45.50,
    \"orderId\": \"$ORDER_ID\",
    \"paymentMethod\": \"pix\",
    \"email\": \"teste@sabordacasa.com.br\",
    \"description\": \"Pedido $ORDER_ID - Sabor da Casa\"
  }")

echo "$PAYMENT_RESPONSE" | grep -q "success.*true"

if [ $? -eq 0 ]; then
  echo "✅ Pagamento PIX criado!"
  
  PAYMENT_URL=$(echo "$PAYMENT_RESPONSE" | grep -o 'https://[^"]*')
  PAYMENT_ID=$(echo "$PAYMENT_RESPONSE" | grep -o '"payment_id":"[^"]*"' | cut -d'"' -f4)
  
  echo ""
  echo "📋 Detalhes do Pagamento:"
  echo "   ID: $PAYMENT_ID"
  echo "   URL: $PAYMENT_URL"
  echo ""
  echo "🎉 INTEGRAÇÃO FUNCIONANDO!"
  echo ""
  echo "Para testar no navegador:"
  echo "   1. Acesse: http://localhost:3000"
  echo "   2. Adicione produtos ao carrinho"
  echo "   3. Finalize o pedido com PIX"
  echo "   4. Você verá um botão para pagar via Mercado Pago"
  echo ""
else
  echo "❌ Falha ao criar pagamento"
  echo "Resposta: $PAYMENT_RESPONSE"
  exit 1
fi
