/**
 * Observabilidade - Preparado para Sentry, DataDog, etc
 *
 * Este módulo centraliza:
 * - Captura de erros
 * - Métricas de performance
 * - Rastreamento de usuários
 * - Breadcrumbs para debug
 *
 * Para ativar Sentry, instale @sentry/nextjs e configure as variáveis de ambiente.
 */

import { logger, LogEntry } from './logger';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface Breadcrumb {
  timestamp: number;
  category: string;
  message: string;
  level: 'debug' | 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 's' | 'count' | 'bytes';
  tags?: Record<string, string>;
}

// Estado global de observabilidade
let currentUser: User | null = null;
const breadcrumbs: Breadcrumb[] = [];
const MAX_BREADCRUMBS = 100;

// Armazena observers para cleanup
const performanceObservers: PerformanceObserver[] = [];

// Interface para Sentry (quando instalado)
interface SentryLike {
  captureException: (error: Error, options?: { extra?: Record<string, unknown>; level?: string }) => void;
  captureMessage: (message: string, level?: string) => void;
  setUser: (user: { id: string; email?: string; username?: string } | null) => void;
  setContext: (name: string, context: Record<string, unknown>) => void;
  addBreadcrumb: (breadcrumb: { category?: string; message?: string; level?: string; data?: Record<string, unknown> }) => void;
}

// Verifica se Sentry está disponível
function getSentry(): SentryLike | null {
  if (typeof window !== 'undefined' && (window as unknown as { Sentry?: SentryLike }).Sentry) {
    return (window as unknown as { Sentry: SentryLike }).Sentry;
  }
  return null;
}

/**
 * Inicializa observabilidade
 * Deve ser chamado uma vez no início da aplicação
 */
export function initObservability(): void {
  // Conecta logger ao sistema de observabilidade
  logger.addListener((entry: LogEntry) => {
    // Adiciona breadcrumb para todos os logs
    addBreadcrumb(entry.level === 'error' || entry.level === 'fatal' ? 'error' : entry.level, entry.message, {
      ...entry.context,
      error: entry.error?.message,
    });

    // Erros vão para Sentry
    if (entry.level === 'error' || entry.level === 'fatal') {
      const sentry = getSentry();
      if (sentry && entry.error) {
        sentry.captureException(new Error(entry.error.message), {
          extra: entry.context,
          level: entry.level === 'fatal' ? 'fatal' : 'error',
        });
      }
    }
  });

  // Captura erros não tratados
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      captureError(event.error || new Error(event.message), {
        source: 'window.onerror',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));

      captureError(error, {
        source: 'unhandledrejection',
      });
    });

    // Performance Observer para Web Vitals
    if ('PerformanceObserver' in window) {
      // Limpa observers anteriores (HMR)
      cleanupObservers();

      try {
        // LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
          recordMetric('web_vital_lcp', lastEntry.startTime, 'ms', { vital: 'LCP' });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        performanceObservers.push(lcpObserver);

        // FID
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as (PerformanceEntry & { processingStart: number; startTime: number })[];
          entries.forEach((entry) => {
            recordMetric('web_vital_fid', entry.processingStart - entry.startTime, 'ms', { vital: 'FID' });
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        performanceObservers.push(fidObserver);

        // CLS
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as (PerformanceEntry & { value: number })[];
          let clsValue = 0;
          entries.forEach((entry) => {
            if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
              clsValue += entry.value;
            }
          });
          recordMetric('web_vital_cls', clsValue, 'count', { vital: 'CLS' });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        performanceObservers.push(clsObserver);
      } catch {
        // Browser não suporta algum observer
      }
    }
  }

  logger.info('Observability initialized', { action: 'observability_init' });
}

/**
 * Define o usuário atual para rastreamento
 */
export function setUser(user: User | null): void {
  currentUser = user;

  const sentry = getSentry();
  if (sentry) {
    if (user) {
      sentry.setUser({ id: user.id, email: user.email, username: user.name });
    } else {
      sentry.setUser(null);
    }
  }

  addBreadcrumb('info', user ? 'User set' : 'User cleared', {
    userId: user?.id,
  });
}

/**
 * Adiciona contexto extra para debug
 */
export function setContext(name: string, context: Record<string, unknown>): void {
  const sentry = getSentry();
  if (sentry) {
    sentry.setContext(name, context);
  }

  addBreadcrumb('info', `Context set: ${name}`, context);
}

/**
 * Adiciona breadcrumb para rastreamento
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>
): void {
  const breadcrumb: Breadcrumb = {
    timestamp: Date.now(),
    category,
    message,
    level: category === 'error' ? 'error' : category === 'warning' ? 'warning' : 'info',
    data,
  };

  breadcrumbs.push(breadcrumb);

  // Mantém limite de breadcrumbs
  if (breadcrumbs.length > MAX_BREADCRUMBS) {
    breadcrumbs.shift();
  }

  const sentry = getSentry();
  if (sentry) {
    sentry.addBreadcrumb({
      category: breadcrumb.category,
      message: breadcrumb.message,
      level: breadcrumb.level,
      data: breadcrumb.data,
    });
  }
}

/**
 * Captura erro manualmente
 */
export function captureError(error: Error, context?: Record<string, unknown>): string {
  const errorId = `err_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  logger.error(error.message, error, {
    ...context,
    errorId,
    userId: currentUser?.id,
  });

  const sentry = getSentry();
  if (sentry) {
    sentry.captureException(error, {
      extra: { ...context, errorId },
    });
  }

  return errorId;
}

/**
 * Captura mensagem/evento
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  const sentry = getSentry();
  if (sentry) {
    sentry.captureMessage(message, level);
  }

  if (level === 'error') {
    logger.error(message);
  } else if (level === 'warning') {
    logger.warn(message);
  } else {
    logger.info(message);
  }
}

/**
 * Registra métrica de performance
 */
export function recordMetric(
  name: string,
  value: number,
  unit: PerformanceMetric['unit'],
  tags?: Record<string, string>
): void {
  const metric: PerformanceMetric = { name, value, unit, tags };

  logger.debug(`Metric: ${name} = ${value}${unit}`, {
    action: 'metric',
    ...metric,
  });

  // Aqui você enviaria para seu backend de métricas
  // Ex: DataDog, Prometheus, etc
}

/**
 * Wrapper para medir tempo de execução
 */
export function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> {
  const start = performance.now();

  return fn().finally(() => {
    const duration = performance.now() - start;
    recordMetric(name, Math.round(duration), 'ms', tags);
  });
}

/**
 * Limpa todos os PerformanceObservers
 */
export function cleanupObservers(): void {
  performanceObservers.forEach(obs => {
    try {
      obs.disconnect();
    } catch {
      // Ignora erros ao desconectar
    }
  });
  performanceObservers.length = 0;
}

/**
 * Retorna breadcrumbs atuais (para debug)
 */
export function getBreadcrumbs(): Breadcrumb[] {
  return [...breadcrumbs];
}

/**
 * Retorna usuário atual
 */
export function getCurrentUser(): User | null {
  return currentUser;
}

// Expõe no window para debug (apenas dev)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as unknown as Record<string, unknown>).observability = {
    getBreadcrumbs,
    getCurrentUser,
    captureError,
    captureMessage,
    setUser,
    setContext,
  };
}

export type { User, Breadcrumb, PerformanceMetric };
