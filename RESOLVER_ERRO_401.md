# 🚨 Como Resolver o Erro "Unauthorized" (401)

## Passo a Passo Rápido

### 1️⃣ Teste seu Token AGORA

Execute este comando no terminal:

```bash
npm run test:mp
```

Ou diretamente:

```bash
node test-mercadopago.js
```

### O que vai acontecer:
- ✅ Vai testar se o token é válido
- ✅ Vai tentar criar um pagamento PIX de teste
- ✅ Vai mostrar EXATAMENTE qual é o problema

---

## 2️⃣ Problemas Comuns e Soluções

### ❌ Erro: "Invalid access token"

**Causa**: Token errado, expirado ou de teste

**Solução Rápida**:

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login
3. Clique em **"Credenciais"** no menu lateral
4. **IMPORTANTE**: Certifique-se de estar na aba **"Produção"** (não "Teste")!
5. Copie o **"Access Token"** que começa com `APP_USR-`
6. Cole no arquivo `.env.local`:
   ```
   MERCADO_PAGO_ACCESS_TOKEN=APP_USR-[cole aqui]
   ```
7. Reinicie o servidor:
   - Pressione `Ctrl+C` no terminal
   - Execute `npm run dev` novamente

---

### ❌ Erro: "Account not activated"

**Causa**: Sua conta no Mercado Pago não está ativa para receber pagamentos

**Solução Rápida**:

1. Acesse: https://www.mercadopago.com.br
2. Faça login
3. Vá em **"Seu negócio" > "Configurações"**
4. Complete os dados solicitados:
   - ✅ Email confirmado
   - ✅ Dados bancários cadastrados
   - ✅ Documento verificado (se solicitado)

---

### ❌ Token de TESTE vs PRODUÇÃO

**Como saber qual você tem:**

```
✅ Token de PRODUÇÃO (CORRETO):
APP_USR-3144487979291729-112815-bb466138d96f0e146971b1025b2aece2-3023878326

❌ Token de TESTE (ERRADO para usar com PIX real):
TEST-3144487979291729-112815-bb466138d96f0e146971b1025b2aece2-3023878326
```

**Se você tiver um token TEST**: Pegue o de produção no painel!

---

## 3️⃣ Verificar se está Funcionando

Depois de corrigir, teste novamente:

```bash
npm run test:mp
```

**Resultado Esperado:**

```
🔍 Testando Access Token do Mercado Pago...

1️⃣ Verificando se o token é válido...
Status: 200 OK
✅ Token válido!
✅ 17 métodos de pagamento disponíveis

2️⃣ Tentando criar pagamento PIX de teste...
Status: 201 Created
✅ Pagamento PIX criado com sucesso!
ID: 123456789
Status: pending

✅ QR Code gerado com sucesso!
Código Pix: 00020126580014br.gov.bcb.pix...

🎉 TUDO FUNCIONANDO! Sua integração está pronta.
```

---

## 4️⃣ Agora Teste no Site

Se o teste acima funcionou, teste no site:

```bash
npm run dev
```

1. Acesse: http://localhost:3000
2. Adicione produtos ao carrinho
3. Vá para o checkout
4. Escolha **PIX**
5. Finalize o pedido
6. ✅ O QR Code real deve aparecer!

---

## 🆘 Ainda não funcionou?

### Verifique o `.env.local`

Abra o arquivo `.env.local` e confirme:

```bash
# ✅ CORRETO
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-3144487979291729-112815-bb466138d96f0e146971b1025b2aece2-3023878326

# ❌ ERRADO (começa com NEXT_PUBLIC_)
NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN=...
```

### Veja os Logs Detalhados

Execute o servidor e veja os logs:

```bash
npm run dev
```

Quando tentar criar um pagamento, você verá:

```
[MP Debug] Token configurado: APP_USR-314448...
[MP Debug] Criando pagamento PIX para: abc123 valor: 50
[MP Debug] Payload: { ... }
[MP Debug] Status da resposta: 401 ou 200
```

Se continuar 401, copie a mensagem de erro completa e consulte: `TROUBLESHOOTING_MP.md`

---

## 📖 Documentação Completa

- `TROUBLESHOOTING_MP.md` - Guia detalhado de troubleshooting
- `INTEGRACAO_MERCADOPAGO.md` - Documentação técnica completa
- `INSTRUCOES_RAPIDAS.md` - Guia de uso

---

## ✅ Checklist Final

Execute na ordem:

- [ ] Executei `npm run test:mp`
- [ ] O token é de **PRODUÇÃO** (começa com `APP_USR-`)
- [ ] O token está no `.env.local` (não tem `NEXT_PUBLIC_` no nome)
- [ ] Reiniciei o servidor após alterar `.env.local`
- [ ] Minha conta Mercado Pago está ativa
- [ ] O teste passou (mostra "TUDO FUNCIONANDO!")
- [ ] Testei no site e o QR Code apareceu

Se todos os itens acima estão ✅, sua integração está funcionando perfeitamente! 🎉
