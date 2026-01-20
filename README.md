# EP LOPES - Sistema de Delivery

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)

Sistema completo de delivery para restaurantes com painel administrativo, cardapio online, carrinho de compras e checkout integrado.

## Indice

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Pre-requisitos](#-pre-requisitos)
- [Instalacao](#-instalacao)
- [Variaveis de Ambiente](#-variaveis-de-ambiente)
- [Scripts](#-scripts)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [API](#-api)
- [Contribuindo](#-contribuindo)

## Features

### Cliente
- Cardapio online com busca e filtros
- Carrinho de compras persistente
- Design responsivo (mobile-first)
- Tema claro/escuro
- Busca por voz
- Sistema de favoritos
- Validacao de CEP para entrega
- Cupons de desconto
- Agendamento de entrega

### Administrador
- Dashboard com metricas
- Gerenciamento de pedidos em tempo real
- CRUD de produtos
- Gerenciamento de usuarios
- Notificacoes de novos pedidos

### Tecnico
- Autenticacao JWT com cookies HttpOnly
- Middleware de protecao de rotas
- Rate limiting com Upstash Redis
- Validacao com Zod (frontend e backend)
- Firebase Firestore com transacoes atomicas
- TypeScript strict mode

## Tech Stack

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 16.1 (App Router) |
| Linguagem | TypeScript 5 |
| UI | React 19 + Tailwind CSS 4 |
| Componentes | shadcn/ui + Radix UI |
| Estado | Zustand |
| Formularios | React Hook Form + Zod |
| Animacoes | Framer Motion |
| Banco de Dados | Firebase Firestore |
| Autenticacao | JWT (jose) |
| Rate Limiting | Upstash Redis |
| Testes | Vitest + Playwright |
| CI/CD | GitHub Actions |

## Pre-requisitos

- Node.js 20+
- npm 10+
- Conta Firebase (Firestore)
- Conta Upstash (opcional, para rate limiting)

## Instalacao

```bash
# Clone o repositorio
git clone https://github.com/seu-usuario/restaurante.git
cd restaurante

# Instale as dependencias
npm install

# Configure as variaveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Rode o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Variaveis de Ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

```env
# Autenticacao (OBRIGATORIO)
ADMIN_PASSWORD=sua-senha-forte
JWT_SECRET=chave-secreta-longa-aleatoria

# Firebase (OBRIGATORIO)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Rate Limiting (opcional)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Scripts

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Build de producao
npm run start        # Inicia servidor de producao

# Qualidade
npm run lint         # Executa ESLint
npm run typecheck    # Verifica tipos TypeScript

# Testes
npm run test         # Executa todos os testes
npm run test:unit    # Testes unitarios (Vitest)
npm run test:e2e     # Testes E2E (Playwright)
npm run test:coverage # Testes com coverage
```

## Estrutura do Projeto

```
src/
├── app/                    # App Router (paginas)
│   ├── api/               # API Routes
│   │   ├── auth/          # Autenticacao
│   │   ├── orders/        # Pedidos
│   │   ├── products/      # Produtos
│   │   └── upload/        # Upload de imagens
│   ├── admin/             # Painel administrativo
│   ├── cardapio/          # Pagina do cardapio
│   ├── checkout/          # Pagina de checkout
│   └── login/             # Pagina de login
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── shared/            # Componentes compartilhados
│   ├── landing/           # Componentes da landing page
│   └── menu/              # Componentes do cardapio
├── store/                 # Zustand stores
├── hooks/                 # Custom hooks
├── lib/                   # Utilitarios
├── types/                 # TypeScript types
├── data/                  # Dados e constantes
└── test/                  # Setup de testes
```

## Testes

### Testes Unitarios (Vitest)

```bash
# Executar testes
npm run test:unit

# Com coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Testes E2E (Playwright)

```bash
# Executar testes
npm run test:e2e

# Com UI
npx playwright test --ui

# Gerar relatorio
npx playwright show-report
```

### Coverage minimo esperado: 70%

## Deploy

### Vercel (Recomendado)

1. Conecte seu repositorio ao Vercel
2. Configure as variaveis de ambiente
3. Deploy automatico a cada push

### Manual

```bash
npm run build
npm run start
```

## API

### Endpoints Publicos

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/products` | Lista produtos |
| POST | `/api/orders` | Cria pedido |
| POST | `/api/auth` | Login |

### Endpoints Protegidos (requer auth)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/api/products` | Cria produto |
| PUT | `/api/products` | Atualiza produto |
| DELETE | `/api/products` | Remove produto |
| GET | `/api/orders` | Lista pedidos |
| PUT | `/api/orders` | Atualiza pedido |
| POST | `/api/upload` | Upload de imagem |
| DELETE | `/api/auth` | Logout |

## Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudancas (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Convencao de Commits

- `feat:` Nova feature
- `fix:` Correcao de bug
- `docs:` Documentacao
- `style:` Formatacao
- `refactor:` Refatoracao
- `test:` Testes
- `chore:` Manutencao

## Licenca

Este projeto esta sob a licenca MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com [Next.js](https://nextjs.org/) e [Firebase](https://firebase.google.com/)
