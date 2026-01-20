# Integração SmartPOS - Próximos Passos

## Situação Atual

O cardápio está funcionando com **39 produtos** carregando do Firebase Firestore em tempo real.
As regras do Firestore estão abertas para teste (lembrar de fechar em produção).

## Objetivo da Integração

Integrar com a API do SmartPOS para:
1. **Controle de estoque** - Quando cliente compra no site, baixar estoque no SmartPOS
2. **Sincronização** - Mapear produtos do site com produtos do SmartPOS automaticamente

## Credenciais da API SmartPOS

**IMPORTANTE: Credenciais sensíveis - não commitar no git!**

Adicionar no `.env.local`:
```
SMARTPOS_API_KEY_SECRET=994VS7K7s4Y1b1qXlfxWBXVegDRMF5Ak7IlF6GeLhylrSXNQjvPj8mTsi6PmtvMiipUQyVYbY2IGpz_VIXTfmw
```

> **Nota**: O desenvolvedor tem acesso apenas à API, não à conta do cliente.
> A integração será feita 100% via API.

## Endpoints da API SmartPOS

Base URL: `https://api.smartpos.app/v1`

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/products?page=1&size=100` | GET | Listar todos os produtos |
| `/products/{id}` | GET | Buscar produto por ID |
| `/products/stock/{id}` | PUT | Atualizar estoque de um produto |
| `/products/stock/batch` | PUT | Atualizar estoque em lote |

### Autenticação

Headers necessários:
```
X-Api-Key-Id: [será obtido listando produtos]
X-Api-Key-Secret: 994VS7K7s4Y1b1qXlfxWBXVegDRMF5Ak7IlF6GeLhylrSXNQjvPj8mTsi6PmtvMiipUQyVYbY2IGpz_VIXTfmw
```

### Atualizar Estoque

```json
PUT /products/stock/{id}
{
  "productId": 123,
  "quantity": 2,
  "stockOperation": "REMOVE"  // REMOVE = diminuir, ADD = aumentar, SET = definir exato
}
```

## O Que Fazer na Próxima Sessão

### 1. Adicionar credencial no .env.local
```bash
# Adicionar linha:
SMARTPOS_API_KEY_SECRET=994VS7K7s4Y1b1qXlfxWBXVegDRMF5Ak7IlF6GeLhylrSXNQjvPj8mTsi6PmtvMiipUQyVYbY2IGpz_VIXTfmw
```

### 2. Criar serviço de integração SmartPOS
Criar arquivo `src/lib/smartpos.ts` com:
- Função para listar produtos do SmartPOS
- Função para atualizar estoque
- Mapeamento automático por nome entre site e SmartPOS

### 3. Criar tabela de mapeamento no Firebase
Coleção `product_mappings` com:
```json
{
  "siteProductId": "prod-1",
  "smartposProductId": 12345,
  "productName": "Batata Frita"
}
```

### 4. Integrar no checkout
No fluxo de finalização do pedido:
1. Cliente finaliza pedido no site
2. Sistema chama API SmartPOS para baixar estoque
3. Pedido é confirmado

### 5. Criar página admin para sincronização
- Botão para buscar produtos do SmartPOS
- Visualizar mapeamento atual
- Sincronizar manualmente se necessário

## Fluxo da Integração

```
Cliente faz pedido no site
         ↓
Pedido salvo no Firebase (orders)
         ↓
Para cada item do pedido:
  → Buscar mapeamento (siteProductId → smartposProductId)
  → Chamar PUT /products/stock/{smartposProductId}
  → stockOperation: "REMOVE", quantity: qtd_comprada
         ↓
Estoque atualizado no SmartPOS
         ↓
Pedido confirmado para o cliente
```

## Arquivos que serão criados/modificados

- `src/lib/smartpos.ts` - Serviço de integração
- `src/app/api/smartpos/sync/route.ts` - API para sincronizar produtos
- `src/app/api/smartpos/stock/route.ts` - API para atualizar estoque
- `src/app/checkout/page.tsx` - Integrar chamada de estoque no checkout
- `.env.local` - Adicionar credenciais

## Documentação SmartPOS

- Portal de desenvolvedores: https://www.smartpos.net.br/developers/
- Documentação API: https://smartpos.readme.io/reference/introdução-à-api

---

**Última atualização**: Janeiro 2026
**Status**: Aguardando próxima sessão para implementação
