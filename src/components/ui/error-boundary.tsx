'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3">
              Ops! Algo deu errado
            </h2>
            <p className="text-muted-foreground mb-6">
              Ocorreu um erro inesperado. Por favor, tente novamente ou volte para a pagina inicial.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry} variant="outline" className="rounded-xl">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Tentar novamente
              </Button>
              <Button asChild className="rounded-xl">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Pagina inicial
                </Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente de erro para páginas
export function PageError({
  title = 'Pagina nao encontrada',
  message = 'A pagina que voce esta procurando nao existe ou foi removida.',
  showHomeButton = true,
}: {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-muted-foreground/20 mb-4">404</div>
        <h1 className="font-serif text-2xl font-bold mb-3">{title}</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        {showHomeButton && (
          <Button asChild className="rounded-xl">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao inicio
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

// Componente de erro para operações
export function OperationError({
  message = 'Ocorreu um erro ao processar sua solicitacao.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-800 dark:text-red-200 font-medium">{message}</p>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="mt-2 text-red-600 hover:text-red-700"
            >
              <RefreshCcw className="w-3 h-3 mr-1" />
              Tentar novamente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de erro de conexão
export function ConnectionError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a4 4 0 010-5.656m-7.072 7.072a4 4 0 010-5.656m-3.536 9.192a9 9 0 010-12.728"
            />
          </svg>
        </div>
        <h2 className="font-semibold text-lg mb-2">Sem conexao</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Verifique sua conexao com a internet e tente novamente.
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="rounded-xl">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
}

// Componente de estado vazio
export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {message && <p className="text-muted-foreground mb-6">{message}</p>}
      {action}
    </div>
  );
}
