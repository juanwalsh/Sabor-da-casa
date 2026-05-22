import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { SkipLink } from '@/components/ui/skip-link';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Sabor da Casa | Bandejão Caseiro - Monte Seu Prato',
    template: '%s | Sabor da Casa',
  },
  description:
    'Bandejão com comida feita na hora, tempero de casa. Monte seu prato do jeito que quiser nas marmitas P, M ou G. Almoço de segunda a sexta.',
  keywords: [
    'bandejao',
    'marmita',
    'monte seu prato',
    'comida caseira',
    'almoco',
    'prato feito',
    'sabor da casa',
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
    title: 'Sabor da Casa | Bandejão Caseiro',
    description:
      'Bandejão com tempero de casa. Monte seu prato nas marmitas P, M ou G. Almoço servido na hora.',
    url: 'https://sabordacasa.com.br',
    siteName: 'Sabor da Casa',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sabor da Casa - Bandejão Caseiro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sabor da Casa | Bandejão Caseiro',
    description: 'Monte seu prato do jeito que quiser. Comida caseira, feita na hora.',
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
    <html lang="pt-BR" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="antialiased min-h-screen bg-background text-foreground overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SkipLink />
          <ErrorBoundary>
            <div id="main-content">{children}</div>
          </ErrorBoundary>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
