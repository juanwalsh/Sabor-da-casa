'use client';

import { Component, ReactNode } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Gera um ID único para rastrear o erro
    const errorId = `err_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log estruturado do erro
    logger.error('React Error Boundary caught error', error, {
      action: 'error_boundary',
      errorId: this.state.errorId || undefined,
      componentStack: errorInfo.componentStack || undefined,
    });

    // Callback opcional para handler externo (Sentry, etc)
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback customizado
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback padrão
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Ops! Algo deu errado
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Encontramos um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
            </p>

            {this.state.errorId && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 font-mono">
                ID do erro: {this.state.errorId}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleRetry} variant="default">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>

              <Button onClick={this.handleGoHome} variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Ir para início
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto text-xs">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC para envolver componentes com Error Boundary
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  const WithErrorBoundaryComponent: React.FC<P> = (props) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `WithErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithErrorBoundaryComponent;
}

// Error Boundary específico para seções da página
export function SectionErrorBoundary({
  children,
  sectionName
}: {
  children: ReactNode;
  sectionName: string;
}): ReactNode {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <p>Não foi possível carregar esta seção.</p>
          <p className="text-sm mt-1">({sectionName})</p>
        </div>
      }
      onError={(error) => {
        logger.error(`Section "${sectionName}" crashed`, error, {
          action: 'section_error',
          section: sectionName,
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
