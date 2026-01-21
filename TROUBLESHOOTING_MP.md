# 🔧 Troubleshooting - Erro "Unauthorized" no Mercado Pago

## 🚨 Erro: "Unauthorized" ao criar pagamento

Este erro acontece quando o Access Token não tem permissão para criar pagamentos. Veja as soluções abaixo:

---

## ✅ Solução 1: Verificar Tipo de Token

### Problema
Você está usando um **Access Token de TESTE** em vez de **PRODUÇÃO**.

### Como Verificar
Os tokens têm prefixos diferentes:
- **Teste**: `TEST-3144487979291729-...`
- **Produção**: `APP_USR-3144487979291729-...`

### Solução
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Suas integrações" > "Credenciais"**
3. **IMPORTANTE**: Certifique-se de estar na aba **"Produção"** (não "Teste")
4. Copie o **Access Token** (começa com `APP_USR-`)
5. Cole no `.env.local`:
   ```bash
   MERCADO_PAGO_ACCESS_TOKEN=APP_USR-XXXXXXXX-XXXXXX-XXXXXXXX-XXXXXXXX
   ```
6. Reinicie o servidor: `Ctrl+C` e depois `npm run dev`

---

## ✅ Solução 2: Conta Não Verificada

### Problema
Sua conta do Mercado Pago não está completamente ativada para receber pagamentos.

### Como Verificar
1. Acesse: https://www.mercadopago.com.br
2. Vá em **"Seu negócio" > "Configurações"**
3. Verifique se há algum aviso de "Ative sua conta"

### Solução
Complete os passos de verificação:
- ✅ Confirme seu email
- ✅ Adicione dados bancários
- ✅ Complete verificação de identidade (se solicitado)
- ✅ Aceite os termos de uso

---

## ✅ Solução 3: Aplicação Não Ativada

### Problema
Sua aplicação no painel do Mercado Pago não está ativa.

### Solução
1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Clique na sua aplicação
3. Verifique se o status está **"Ativa"**
4. Se não estiver, ative a aplicação

---

## ✅ Solução 4: Token Expirado ou Revogado

### Problema
O token foi revogado ou expirou.

### Solução
Gere um novo token:
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Suas integrações" > "Credenciais"**
3. Clique em **"Gerar novas credenciais"**
4. Copie o novo Access Token
5. Atualize no `.env.local`

---

## 🧪 Como Testar seu Token

### Opção 1: Script de Teste Rápido

Execute o script de teste que criamos:

```bash
node test-mercadopago.js
```

Ele vai:
1. ✅ Verificar se o token é válido
2. ✅ Tentar criar um pagamento PIX de teste
3. ✅ Mostrar mensagens de erro detalhadas

### Opção 2: Teste Manual via cURL

```bash
# Substitua SEU_TOKEN pelo seu Access Token
curl -X POST https://api.mercadopago.com/v1/payments \
  -H "Authorization: Bearer SEU_TOKEN" \
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

**Respostas Esperadas:**

✅ **Sucesso (200)**:
```json
{
  "id": 123456789,
  "status": "pending",
  "point_of_interaction": {
    "transaction_data": {
      "qr_code": "00020126...",
      "qr_code_base64": "iVBORw0KGgo..."
    }
  }
}
```

❌ **Não Autorizado (401)**:
```json
{
  "message": "Invalid access token",
  "error": "unauthorized",
  "status": 401
}
```

---

## 🔍 Verificando Logs do Servidor

Se ainda estiver com problemas, verifique os logs do servidor:

```bash
npm run dev
```

Quando tentar criar um pagamento, você verá no console:

```
[MP Debug] Token configurado: APP_USR-314448...
[MP Debug] Criando pagamento PIX para: abc123 valor: 50
[MP Debug] Payload: { ... }
[MP Debug] Status da resposta: 401
[MP Erro] Detalhes completos: { "message": "...", ... }
```

---

## 📋 Checklist Completo

Siga esta ordem:

- [ ] 1. Verifique se está usando token de **PRODUÇÃO** (começa com `APP_USR-`)
- [ ] 2. Confirme que o token está no `.env.local` (não em variável `NEXT_PUBLIC_*`)
- [ ] 3. Reinicie o servidor após alterar `.env.local`
- [ ] 4. Verifique se sua conta Mercado Pago está ativa e verificada
- [ ] 5. Execute o script de teste: `node test-mercadopago.js`
- [ ] 6. Veja os logs detalhados no console do servidor

---

## 🆘 Ainda com problemas?

### 1. Verifique se o problema é com PIX

Tente criar um pagamento com outro método (boleto):

```bash
curl -X POST https://api.mercadopago.com/v1/payments \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_amount": 10.00,
    "description": "Teste Boleto",
    "payment_method_id": "bolbradesco",
    "payer": {
      "email": "teste@email.com"
    }
  }'
```

Se funcionar, o problema pode ser específico com PIX (conta não habilitada para PIX).

### 2. Contate o Suporte do Mercado Pago

- Email: developers@mercadopago.com
- Fórum: https://www.mercadopago.com.br/developers/pt/support

Informe:
- Seu User ID
- Mensagem de erro completa
- Logs do servidor

---

## 📖 Documentação Oficial

- [Primeiros Passos](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/prerequisites)
- [Credenciais](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/credentials)
- [PIX](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-pix)
