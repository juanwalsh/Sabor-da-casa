# 🛒 Integração Mercado Pago + SmartPOS

Este documento explica como funciona a integração completa entre o site, o gateway de pagamento Mercado Pago e o sistema de estoque SmartPOS.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Fluxo de Pagamento](#fluxo-de-pagamento)
3. [Configuração](#configuração)
4. [Segurança](#segurança)
5. [Webhooks](#webhooks)
6. [Testes](#testes)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

A integração automatiza todo o processo de:
- ✅ Geração de pagamento PIX real via Mercado Pago
- ✅ Validação automática de pagamento via webhook
- ✅ Atualização do status do pedido em tempo real
- ✅ Baixa automática de estoque no SmartPOS

### Arquitetura

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Cliente   │ ───> │   Seu Servidor   │ ───> │  Mercado    │
│  (Browser)  │      │   (Next.js API)  │      │    Pago     │
└─────────────┘      └──────────────────┘      └─────────────┘
      │                      │                         │
      │                      │ (Webhook)               │
      │                      │ <───────────────────────┘
      │                      │
      │                      ▼
      │              ┌──────────────┐
      │              │   Firebase   │
      │              │  (Database)  │
      │              └──────────────┘
      │                      │
      │                      ▼
      │              ┌──────────────┐
      └────────────> │   SmartPOS   │
    (Atualização)    │   (Estoque)  │
                     └──────────────┘
```

---

## 💳 Fluxo de Pagamento

### 1. Cliente Finaliza Pedido

```tsx
// Cliente clica em "Finalizar Pedido" no checkout
// O sistema cria um pedido no Firebase com status "pending"
```

### 2. Geração de Pagamento PIX

```typescript
// src/app/api/payments/create/route.ts
POST /api/payments/create
{
  "amount": 50.00,
  "orderId": "abc123",
  "paymentMethod": "pix",
  "email": "cliente@email.com",
  "description": "Pedido ABC123 - Sabor da Casa"
}

// Resposta
{
  "success": true,
  "method": "pix",
  "qr_code": "00020126...",  // Código Pix Copia e Cola
  "qr_code_base64": "iVBORw0KGgo...",  // QR Code em base64
  "payment_id": "123456789",
  "status": "pending"
}
```

### 3. Cliente Paga via PIX

- Cliente escaneia o QR Code ou copia o código Pix
- Realiza o pagamento no banco
- Mercado Pago detecta o pagamento instantaneamente

### 4. Webhook Recebe Notificação

```typescript
// src/app/api/webhooks/mercadopago/route.ts
POST /api/webhooks/mercadopago
{
  "data": {
    "id": "123456789"  // ID do pagamento aprovado
  }
}
```

### 5. Sistema Valida e Processa

```typescript
// 1. Busca status do pagamento no Mercado Pago
const payment = await getPaymentStatus(paymentId);

// 2. Se aprovado, atualiza pedido no Firebase
if (payment.status === "approved") {
  await updateDoc(orderRef, {
    status: "confirmed",
    paidAt: new Date().toISOString(),
    paymentId: paymentId
  });

  // 3. Baixa estoque no SmartPOS
  await fetch('/api/smartpos/process-order', {
    method: 'POST',
    body: JSON.stringify({ items: orderData.items })
  });
}
```

### 6. Cliente Vê Confirmação

- O modal detecta a mudança no Firebase (realtime)
- Exibe mensagem de sucesso
- Redireciona para página de confirmação

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie/edite o arquivo `.env.local`:

```bash
# Mercado Pago (OBRIGATÓRIO)
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-XXXXXXXX-XXXXXX-XXXXXXXXXXXXXXXX-XXXXXXXXXX

# SmartPOS (OBRIGATÓRIO)
SMARTPOS_API_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# URL do Site (OBRIGATÓRIO para webhooks)
# Desenvolvimento
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Produção
NEXT_PUBLIC_SITE_URL=https://seudominio.com.br

# Firebase (já configurado)
NEXT_PUBLIC_FIREBASE_API_KEY=...
```

### 2. Obter Access Token do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em "Suas integrações" > "Credenciais"
3. Copie o **Access Token de Produção** (começa com `APP_USR-`)
4. Cole no `.env.local`

⚠️ **NUNCA** exponha esse token no front-end ou em commits públicos!

### 3. Configurar Webhook no Mercado Pago

#### Em Desenvolvimento (Teste Local)

Para testar localmente, você precisa expor sua porta 3000:

```bash
# Opção 1: ngrok
npx ngrok http 3000

# Opção 2: localtunnel
npx localtunnel --port 3000
```

Copie a URL gerada (ex: `https://abc123.ngrok.io`) e configure no painel do Mercado Pago.

#### Em Produção

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em "Suas integrações" > "Webhooks"
3. Adicione a URL:
   ```
   https://seudominio.com.br/api/webhooks/mercadopago
   ```
4. Eventos a notificar:
   - ✅ `payment` (Pagamentos)

---

## 🔒 Segurança

### ✅ Implementações de Segurança

1. **Chaves no Servidor**
   - Todas as chaves sensíveis estão em `.env.local`
   - Nunca são expostas ao front-end
   - Apenas rotas API do servidor têm acesso

2. **Validação de Pagamento**
   - Webhook sempre valida status real no Mercado Pago
   - Não confia apenas nos dados do webhook
   - Evita duplicação com verificação de status anterior

3. **Idempotência**
   - Usa `X-Idempotency-Key` para evitar cobranças duplicadas
   - Verifica se pedido já foi processado antes

4. **Logs Seguros**
   ```typescript
   // ✅ BOM
   console.log(`[Webhook] Processando pagamento ID: ${paymentId}`);

   // ❌ RUIM (expõe dados sensíveis)
   console.log(payment.payer.identification.number);
   ```

### 🚫 O que NÃO Fazer

❌ **NUNCA** coloque chaves em variáveis `NEXT_PUBLIC_*`
```bash
# ❌ ERRADO
NEXT_PUBLIC_MERCADO_PAGO_TOKEN=APP_USR-xxx

# ✅ CORRETO
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxx
```

❌ **NUNCA** commit o arquivo `.env.local`
```bash
# Adicione ao .gitignore
.env.local
.env*.local
```

❌ **NUNCA** processe dados de cartão diretamente
- Use SDK do Mercado Pago para tokenização
- Ou redirecione para Checkout Pro

---

## 🔔 Webhooks

### Como Funciona

O Mercado Pago envia uma notificação POST para sua API sempre que:
- Um pagamento é aprovado ✅
- Um pagamento é rejeitado ❌
- Um pagamento é cancelado 🚫

### Estrutura da Notificação

```json
{
  "action": "payment.updated",
  "api_version": "v1",
  "data": {
    "id": "123456789"  // ID do pagamento
  },
  "date_created": "2026-01-20T10:30:00.000Z",
  "id": 987654321,
  "live_mode": true,
  "type": "payment",
  "user_id": "3023878326"
}
```

### Resposta Esperada

Seu webhook deve sempre retornar HTTP 200:

```typescript
return NextResponse.json({ status: "ok" });
```

Caso contrário, o Mercado Pago tentará reenviar a notificação.

### Testando Webhooks

#### 1. Teste com Webhook.site

```bash
# 1. Acesse https://webhook.site e copie sua URL única
# 2. Configure temporariamente no Mercado Pago
# 3. Faça um pagamento de teste
# 4. Veja a estrutura da notificação
```

#### 2. Teste Local com ngrok

```bash
# Terminal 1
npm run dev

# Terminal 2
npx ngrok http 3000

# Copie a URL https e configure no Mercado Pago
# Webhook URL: https://abc123.ngrok.io/api/webhooks/mercadopago
```

---

## 🧪 Testes

### 1. Testar Pagamento PIX Local

```bash
# 1. Inicie o servidor
npm run dev

# 2. Faça um pedido no site
# 3. Na tela de pagamento, copie o código Pix

# 4. Simule aprovação (desenvolvimento apenas)
curl -X POST http://localhost:3000/api/webhooks/mercadopago \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "id": "SEU_PAYMENT_ID_AQUI"
    }
  }'
```

⚠️ Nota: Em desenvolvimento, o pagamento não será real. Use a conta de testes do Mercado Pago.

### 2. Conta de Testes do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/test-users
2. Crie usuários de teste (comprador e vendedor)
3. Use as credenciais de teste no `.env.local`

### 3. Testar Integração SmartPOS

```bash
# Verifique se o produto está mapeado
GET http://localhost:3000/api/smartpos/mappings

# Teste baixa de estoque manualmente
POST http://localhost:3000/api/smartpos/process-order
{
  "items": [
    {
      "product": { "id": "1", "name": "Pizza Margherita" },
      "quantity": 2
    }
  ]
}
```

---

## 🔧 Troubleshooting

### Problema: Webhook não recebe notificações

**Solução 1**: Verifique a URL configurada
```bash
# Deve ser HTTPS em produção
https://seudominio.com.br/api/webhooks/mercadopago

# Em desenvolvimento, use ngrok
https://abc123.ngrok.io/api/webhooks/mercadopago
```

**Solução 2**: Verifique os logs do servidor
```typescript
// Adicione logs no webhook
console.log("[Webhook] Recebeu notificação:", body);
```

**Solução 3**: Teste manualmente
```bash
curl -X POST https://seudominio.com.br/api/webhooks/mercadopago \
  -H "Content-Type: application/json" \
  -d '{"data":{"id":"123"}}'
```

---

### Problema: Pagamento PIX não é gerado

**Solução 1**: Verifique o Access Token
```bash
# No .env.local
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-...
```

**Solução 2**: Verifique logs da API
```typescript
// src/app/api/payments/create/route.ts
console.error("Payment API Error:", error);
```

**Solução 3**: Teste diretamente a API do Mercado Pago
```bash
curl -X POST https://api.mercadopago.com/v1/payments \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_amount": 10.00,
    "description": "Teste",
    "payment_method_id": "pix",
    "payer": {
      "email": "teste@email.com"
    }
  }'
```

---

### Problema: Estoque não é baixado no SmartPOS

**Solução 1**: Verifique mapeamento de produtos
```bash
# Acesse o painel admin
http://localhost:3000/admin/smartpos

# Verifique se os produtos estão mapeados
```

**Solução 2**: Verifique credenciais do SmartPOS
```bash
# No .env.local
SMARTPOS_API_KEY_SECRET=...
```

**Solução 3**: Teste a API do SmartPOS diretamente
```typescript
// src/lib/smartpos.ts
const products = await getSmartPOSProducts();
console.log("Produtos SmartPOS:", products);
```

---

## 📚 Referências

- [Documentação Mercado Pago - PIX](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-pix)
- [Documentação Mercado Pago - Webhooks](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/notifications/webhooks)
- [Documentação SmartPOS](https://docs.smartpos.app)
- [Firebase Realtime Updates](https://firebase.google.com/docs/firestore/query-data/listen)

---

## 🎉 Conclusão

A integração está completa e segura! O sistema agora:

✅ Gera pagamentos PIX reais via Mercado Pago
✅ Valida pagamentos automaticamente via webhook
✅ Atualiza status em tempo real no Firebase
✅ Baixa estoque automaticamente no SmartPOS
✅ Mantém todas as chaves seguras no servidor

Para dúvidas ou problemas, consulte este documento ou os logs do servidor.
