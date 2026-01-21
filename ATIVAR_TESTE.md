# 🧪 Como Usar Conta de TESTE

## 1. Criar Usuários de Teste

1. Acesse: https://www.mercadopago.com.br/developers/panel/test-users
2. Clique em **"Criar usuário de teste"**
3. Selecione **"Vendedor"**
4. Preencha:
   - País: Brasil
   - Valor: R$ 1000 (saldo inicial)
5. Clique em **"Criar"**
6. Anote o email e senha gerados

## 2. Obter Token de TESTE

1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Clique em **"Credenciais de TESTE"** (aba)
3. Copie o **Access Token de TESTE** (começa com `TEST-`)

## 3. Configurar no Projeto

Abra `.env.local` e substitua:

```bash
# Token de TESTE (temporário)
MERCADO_PAGO_ACCESS_TOKEN=TEST-[seu-token-aqui]
```

## 4. Reiniciar Servidor

```bash
npm run dev
```

## 5. Testar

Com token de TESTE:
- ✅ QR Code PIX é gerado DIRETO no site
- ✅ Você pode testar pagamento com usuário comprador de teste
- ✅ Tudo funciona igual produção

## 6. Depois que Ativar Produção

Volte para token de PRODUÇÃO:

```bash
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-3144487979291729-112815-bb466138d96f0e146971b1025b2aece2-3023878326
```

---

**IMPORTANTE**: Token de TESTE só funciona em desenvolvimento. Para produção, precisa ativar Checkout Transparente na conta real.
