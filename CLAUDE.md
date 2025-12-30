# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Architecture Overview

This is a restaurant delivery website ("Sabor da Casa") built with Next.js 16.1 using the App Router, React 19, and TypeScript.

### Tech Stack
- **UI**: Tailwind CSS 4 + shadcn/ui (new-york style) + Radix UI primitives
- **State**: Zustand with persist middleware for cart, auth, and orders
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Charts**: Recharts (admin dashboard)
- **Theming**: next-themes (light/dark mode)
- **Notifications**: Sonner

### Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout with SEO metadata
│   ├── cardapio/         # Full menu page with filters/search
│   ├── checkout/         # Checkout with WhatsApp integration
│   ├── login/            # Admin login
│   └── admin/            # Admin panel (dashboard, pedidos, produtos)
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── shared/           # Navbar, ThemeToggle, CartButton
│   ├── landing/          # Hero, Features, MenuHighlights, Testimonials, Footer
│   └── menu/             # CartSidebar, ProductModal
├── store/
│   ├── cartStore.ts      # Cart state with animation triggers
│   ├── authStore.ts      # Authentication (demo: admin@sabordacasa.com.br / admin123)
│   └── orderStore.ts     # Order management
├── hooks/
│   └── useActiveSection.ts  # Intersection Observer for nav highlighting
├── types/                # TypeScript interfaces
├── data/                 # Mock data and constants
└── lib/                  # Utilities (cn function)
```

### Key Patterns

- **Path Alias**: Use `@/*` for imports from `src/*`
- **Language**: Portuguese (pt-BR) for UI text and comments
- **Styling**: Use `cn()` utility from `@/lib/utils` for conditional Tailwind classes
- **Images**: Use `next/image` with Unsplash domain configured
- **Cart State**: `useCartStore()` persists to localStorage as `sabor-da-casa-cart`
- **Auth State**: `useAuthStore()` with demo credentials for admin access
- **Pricing**: `formatPrice()` helper; constants `DELIVERY_FEE` (R$8) and `FREE_DELIVERY_MIN` (R$80)

### Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with all sections |
| `/cardapio` | Full menu with search, filters, sorting |
| `/checkout` | Order form with WhatsApp integration |
| `/login` | Admin authentication |
| `/admin` | Dashboard with stats and charts |
| `/admin/pedidos` | Order management |
| `/admin/produtos` | Product management |

### PWA

Manifest configured at `/public/manifest.json`. Icons should be placed in `/public/icons/`.
