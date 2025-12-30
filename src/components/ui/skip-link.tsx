'use client';

/**
 * Skip Link para acessibilidade
 * Permite que usuários de leitores de tela pulem direto para o conteúdo principal
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Pular para o conteudo principal
    </a>
  );
}

/**
 * Wrapper para o conteúdo principal
 * Deve envolver o conteúdo principal da página
 */
export function MainContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <main id="main-content" tabIndex={-1} className={`outline-none ${className}`}>
      {children}
    </main>
  );
}
