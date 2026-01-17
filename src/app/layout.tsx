import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { CartNotification } from '@/components/ui/cart-notification';
import { ServiceWorkerProvider } from '@/components/providers/service-worker-provider';
import { Chatbot } from '@/components/ui/chatbot';
import { BottomNav } from '@/components/ui/bottom-nav';
import { SkipLink } from '@/components/ui/skip-link';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'EP LOPES FORTE DO GELO | Deposito de Bebidas',
    template: '%s | EP LOPES FORTE DO GELO',
  },
  description:
    'O melhor deposito de bebidas da regiao. Cerveja gelada, drinks, energeticos e muito mais! Delivery rapido e precos imbativeis.',
  keywords: [
    'deposito de bebidas',
    'delivery',
    'cerveja gelada',
    'bebidas',
    'drinks',
    'energeticos',
    'forte do gelo',
    'ep lopes',
  ],
  authors: [{ name: 'EP LOPES' }],
  creator: 'EP LOPES',
  publisher: 'EP LOPES',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://eplopes.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'EP LOPES FORTE DO GELO | Deposito de Bebidas',
    description:
      'O melhor deposito de bebidas da regiao. Cerveja gelada, drinks, energeticos e muito mais!',
    url: 'https://eplopes.com.br',
    siteName: 'EP LOPES FORTE DO GELO',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EP LOPES FORTE DO GELO - Deposito de Bebidas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EP LOPES FORTE DO GELO | Deposito de Bebidas',
    description:
      'O melhor deposito de bebidas da regiao. Cerveja gelada, drinks e muito mais!',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ServiceWorkerProvider>
            <SkipLink />
            <ErrorBoundary>
              <div id="main-content" className="pb-16 md:pb-0">
                {children}
              </div>
            </ErrorBoundary>
            <CartNotification />
            <Chatbot />
            <BottomNav />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                },
              }}
            />
          </ServiceWorkerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
