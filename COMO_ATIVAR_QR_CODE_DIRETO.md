# 🎯 Como Ter QR Code PIX Direto no Site

## ❌ Problema Atual 

Sua conta Mercado Pago **NÃO está ativada** para **Checkout Transparente**.

Resultado:
- ❌ QR Code PIX não aparece direto no site
- ✅ Funciona redirecionando para Mercado Pago (Preference)

---

## ✅ SOLUÇÃO: Ativar Checkout Transparente

### **Opção 1: Solicitar Ativação (PRODUÇÃO)**

1. **Acesse o Painel**:
   - https://www.mercadopago.com.br/developers/panel

2. **Entre em Contato**:
   - Email: developers@mercadopago.com
   - Assunto: "Solicitação de Ativação - Checkout Transparente / Checkout API"

3. **Modelo de Email**:
   ```
   Olá,

   Gostaria de solicitar a ativação do Checkout Transparente (Checkout API)
   para minha conta Mercado Pago.

   Informações:
   - User ID: [seu user ID]
   - Email da conta: [seu email]
   - Aplicação: Sabor da Casa - Restaurante Delivery
   - Necessidade: Gerar QR Code PIX direto no site sem redirecionamento

   Aguardo retorno.
   ```

4. **Aguarde Aprovação**:
   - Pode ser automático ou levar algumas horas/dias
   - Você receberá email de confirmação

---

### **Opção 2: Usar Conta de TESTE (DESENVOLVIMENTO)**

Para testar AGORA enquanto aguarda ativação:

#### 1. Criar Usuário de Teste

1. Acesse: https://www.mercadopago.com.br/developers/panel/test-users
2. Clique em **"Criar usuário de teste"**
3. Selecione **"Vendedor"**
4. Preencha:
   - **País**: Brasil
   - **Valor**: R$ 1000 (saldo inicial)
5. Clique em **"Criar"**
6. **Anote o email e senha** gerados

#### 2. Obter Token de TESTE

1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Clique na aba **"Credenciais de TESTE"**
3. Copie o **"Access Token de Teste"** (começa com `TEST-`)

#### 3. Configurar no Projeto

Abra `.env.local` e **substitua** o token:

```bash
# Token de TESTE (temporário)
MERCADO_PAGO_ACCESS_TOKEN=TEST-[cole-seu-token-aqui]
```

#### 4. Reiniciar Servidor

```bash
# Pare o servidor (Ctrl+C) e reinicie
npm run dev
```

#### 5. Testar

Agora ao fazer um pedido:
- ✅ QR Code PIX aparece **DIRETO** no site
- ✅ Você pode testar pagamento real
- ✅ Tudo funciona igual produção

---

## 🔄 Depois que Ativar Produção

Quando o Mercado Pago ativar sua conta:

1. Volte para token de **PRODUÇÃO** no `.env.local`:
   ```bash
   MERCADO_PAGO_ACCESS_TOKEN=APP_USR-3144487979291729-112815-bb466138d96f0e146971b1025b2aece2-3023878326
   ```

2. Reinicie o servidor:
   ```bash
   npm run dev
   ```

3. **Funcionará automaticamente!**
   - O código já detecta se a conta suporta Checkout Transparente
   - Se suportar: Gera QR Code direto
   - Se não suportar: Redireciona (como está agora)

---

## 🧠 Como o Código Funciona Agora

```typescript
// src/lib/mercadopago.ts

export async function createPixPayment(data) {
  // 1. TENTA Checkout Transparente (QR Code direto)
  try {
    const payment = new Payment(client);
    const result = await payment.create({ ... });

    // ✅ Se funcionar, retorna QR Code direto
    return result;

  } catch (error) {
    // 2. Se NÃO funcionar, usa Preference (redireciona)
    if (error.message.includes("Unauthorized use")) {
      const preference = new Preference(client);
      const result = await preference.create({ ... });

      // ✅ Retorna URL de redirecionamento
      return result;
    }
  }
}
```

**Resultado**: O código **se adapta automaticamente** à sua conta!

---

## 📊 Comparação

| Aspecto | Preference (Atual) | Checkout Transparente (Após Ativar) |
|---------|-------------------|-------------------------------------|
| QR Code no site | ❌ Não | ✅ Sim |
| Redireciona | ✅ Sim | ❌ Não |
| Cliente sai do site | ✅ Sim | ❌ Não |
| Funciona agora | ✅ Sim | ❌ Precisa ativar |
| Segurança | ✅ Alta | ✅ Alta |
| PIX | ✅ Sim | ✅ Sim |
| Cartão | ✅ Sim | ✅ Sim |

---

## 🆘 Dúvidas Comuns

### "Por que não funciona QR Code direto?"
Sua conta não tem permissão para Checkout Transparente. Precisa solicitar ao Mercado Pago.

### "Posso usar em produção?"
Sim! O redirecionamento (Preference) funciona perfeitamente em produção.

### "O cliente vai estranhar?"
Não. É comum redirecionar para página de pagamento segura (igual PagSeguro, PayPal, etc).

### "Quanto tempo leva para ativar?"
Varia. Pode ser automático ou levar alguns dias. Use conta de TESTE enquanto aguarda.

### "Depois que ativar preciso mudar código?"
**NÃO!** O código já está preparado e detecta automaticamente.

---

## 📞 Contato Mercado Pago

- **Email**: developers@mercadopago.com
- **Painel**: https://www.mercadopago.com.br/developers/panel
- **Docs**: https://www.mercadopago.com.br/developers/pt/docs/checkout-api
- **Suporte**: https://www.mercadopago.com.br/developers/pt/support

---

## ✅ Resumo

**AGORA:**
- ✅ Sistema funcionando com redirecionamento
- ✅ Pagamentos PIX via Mercado Pago
- ✅ Seguro e confiável

**DEPOIS de ativar:**
- ✅ QR Code direto no site (sem código adicional!)
- ✅ Cliente não sai do site
- ✅ Experiência melhorada

**ENQUANTO aguarda:**
- Use token de TESTE para desenvolver/testar
- Sistema funciona igual produção
