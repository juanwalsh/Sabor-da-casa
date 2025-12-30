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
    default: 'Sabor da Casa | Comida Caseira com Sabor de Fazenda',
    template: '%s | Sabor da Casa',
  },
  description:
    'Há mais de 15 anos trazendo o verdadeiro sabor da comida brasileira para a sua mesa. Delivery de comida caseira em São Paulo. Feijoada, escondidinho, frango caipira e muito mais!',
  keywords: [
    'comida caseira',
    'delivery',
    'restaurante',
    'São Paulo',
    'feijoada',
    'marmita',
    'comida brasileira',
    'entrega de comida',
  ],
  authors: [{ name: 'Sabor da Casa' }],
  creator: 'Sabor da Casa',
  publisher: 'Sabor da Casa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sabordacasa.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sabor da Casa | Comida Caseira com Sabor de Fazenda',
    description:
      'Há mais de 15 anos trazendo o verdadeiro sabor da comida brasileira para a sua mesa. Delivery de comida caseira em São Paulo.',
    url: 'https://sabordacasa.com.br',
    siteName: 'Sabor da Casa',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sabor da Casa - Comida Caseira',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sabor da Casa | Comida Caseira com Sabor de Fazenda',
    description:
      'Há mais de 15 anos trazendo o verdadeiro sabor da comida brasileira para a sua mesa.',
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
