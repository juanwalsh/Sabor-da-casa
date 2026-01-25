/**
 * Sistema de Logging Estruturado
 *
 * Níveis: debug < info < warn < error < fatal
 * Em produção, apenas warn+ são logados
 * Preparado para integração com serviços externos (Sentry, DataDog, etc)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogContext {
  userId?: string;
  orderId?: string;
  productId?: string;
  action?: string;
  duration?: number;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

// Em produção, só loga warn+
const MIN_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

// Buffer para logs que serão enviados em batch
const logBuffer: LogEntry[] = [];
const BUFFER_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 segundos

// Listeners externos (Sentry, DataDog, etc)
type LogListener = (entry: LogEntry) => void;
const listeners: LogListener[] = [];

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function formatEntry(entry: LogEntry): string {
  const { timestamp, level, message, context, error } = entry;
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  const errorStr = error ? ` [${error.name}: ${error.message}]` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}${errorStr}`;
}

function createEntry(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    error: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : undefined,
  };
}

function processEntry(entry: LogEntry): void {
  // Console output
  const formatted = formatEntry(entry);
  switch (entry.level) {
    case 'debug':
      console.debug(formatted);
      break;
    case 'info':
      console.info(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'error':
    case 'fatal':
      console.error(formatted);
      break;
  }

  // Notifica listeners externos
  listeners.forEach(listener => {
    try {
      listener(entry);
    } catch {
      // Listener falhou, não propaga erro
    }
  });

  // Adiciona ao buffer para envio em batch
  if (entry.level !== 'debug') {
    logBuffer.push(entry);
    if (logBuffer.length >= BUFFER_SIZE) {
      flushLogs();
    }
  }
}

async function flushLogs(): Promise<void> {
  if (logBuffer.length === 0) return;

  const logsToSend = [...logBuffer];
  logBuffer.length = 0;

  // Aqui você enviaria para seu serviço de logs
  // Exemplo: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(logsToSend) });

  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Logger] Flushed ${logsToSend.length} logs`);
  }
}

// Armazena referencia do interval para evitar memory leak
let flushInterval: ReturnType<typeof setInterval> | null = null;

// Flush periódico
if (typeof window !== 'undefined') {
  // Limpa interval anterior se existir (HMR)
  if (flushInterval) {
    clearInterval(flushInterval);
  }
  flushInterval = setInterval(flushLogs, FLUSH_INTERVAL);

  // Flush antes de fechar a página
  window.addEventListener('beforeunload', () => {
    if (flushInterval) {
      clearInterval(flushInterval);
    }
    flushLogs();
  });
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (!shouldLog('debug')) return;
    processEntry(createEntry('debug', message, context));
  },

  info(message: string, context?: LogContext): void {
    if (!shouldLog('info')) return;
    processEntry(createEntry('info', message, context));
  },

  warn(message: string, context?: LogContext): void {
    if (!shouldLog('warn')) return;
    processEntry(createEntry('warn', message, context));
  },

  error(message: string, error?: Error, context?: LogContext): void {
    if (!shouldLog('error')) return;
    processEntry(createEntry('error', message, context, error));
  },

  fatal(message: string, error?: Error, context?: LogContext): void {
    if (!shouldLog('fatal')) return;
    processEntry(createEntry('fatal', message, context, error));
    // Fatal sempre faz flush imediato
    flushLogs();
  },

  // Para medir performance
  time(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = Math.round(performance.now() - start);
      this.info(`${label} completed`, { duration, action: 'timing' });
    };
  },

  // Registra listener externo (Sentry, DataDog, etc)
  addListener(listener: LogListener): () => void {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },

  // Força flush dos logs
  flush: flushLogs,
};

export type { LogLevel, LogContext, LogEntry, LogListener };
