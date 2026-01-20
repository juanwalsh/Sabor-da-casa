/**
 * Cliente HTTP Resiliente
 *
 * Features:
 * - Retry automático com exponential backoff
 * - Circuit breaker para evitar sobrecarga
 * - Timeout configurável
 * - Logging integrado
 */

import { logger } from './logger';

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  circuitBreakerKey?: string;
}

interface CircuitState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
}

// Circuit breaker state por endpoint
const circuits: Map<string, CircuitState> = new Map();

const CIRCUIT_THRESHOLD = 5; // Falhas antes de abrir
const CIRCUIT_RESET_TIME = 30000; // 30 segundos para resetar
const DEFAULT_TIMEOUT = 10000; // 10 segundos
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 segundo

function getCircuitState(key: string): CircuitState {
  if (!circuits.has(key)) {
    circuits.set(key, { failures: 0, lastFailure: 0, isOpen: false });
  }
  return circuits.get(key)!;
}

function recordSuccess(key: string): void {
  const state = getCircuitState(key);
  state.failures = 0;
  state.isOpen = false;
}

function recordFailure(key: string): void {
  const state = getCircuitState(key);
  state.failures++;
  state.lastFailure = Date.now();

  if (state.failures >= CIRCUIT_THRESHOLD) {
    state.isOpen = true;
    logger.warn(`Circuit breaker opened for ${key}`, {
      action: 'circuit_breaker_open',
      failures: state.failures
    });
  }
}

function isCircuitOpen(key: string): boolean {
  const state = getCircuitState(key);

  if (!state.isOpen) return false;

  // Verifica se já passou tempo suficiente para tentar novamente
  if (Date.now() - state.lastFailure > CIRCUIT_RESET_TIME) {
    state.isOpen = false;
    state.failures = 0;
    logger.info(`Circuit breaker reset for ${key}`, { action: 'circuit_breaker_reset' });
    return false;
  }

  return true;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export class FetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

export class CircuitOpenError extends Error {
  constructor(key: string) {
    super(`Circuit breaker is open for ${key}`);
    this.name = 'CircuitOpenError';
  }
}

export async function resilientFetch<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    circuitBreakerKey = new URL(url, window?.location?.origin || 'http://localhost').pathname,
    ...fetchOptions
  } = options;

  // Verifica circuit breaker
  if (isCircuitOpen(circuitBreakerKey)) {
    throw new CircuitOpenError(circuitBreakerKey);
  }

  const endTiming = logger.time(`fetch ${url}`);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, attempt - 1);
        logger.debug(`Retry attempt ${attempt} for ${url}`, {
          action: 'fetch_retry',
          delay
        });
        await sleep(delay);
      }

      const response = await fetchWithTimeout(url, fetchOptions, timeout);

      if (!response.ok) {
        // Não faz retry para erros 4xx (exceto 429 - rate limit)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          recordFailure(circuitBreakerKey);
          throw new FetchError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            response
          );
        }

        // Retry para 5xx e 429
        throw new FetchError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response
        );
      }

      recordSuccess(circuitBreakerKey);
      endTiming();

      // Tenta parsear como JSON, senão retorna texto
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      return await response.text() as T;

    } catch (error) {
      lastError = error as Error;

      if (error instanceof FetchError && error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
        // Não faz retry para erros de cliente
        throw error;
      }

      if ((error as Error).name === 'AbortError') {
        lastError = new FetchError(`Request timeout after ${timeout}ms`);
      }

      logger.warn(`Fetch failed for ${url}`, {
        action: 'fetch_error',
        attempt,
        error: (error as Error).message
      });

      // Se é a última tentativa, registra falha e lança erro
      if (attempt === retries) {
        recordFailure(circuitBreakerKey);
        logger.error(`All retries exhausted for ${url}`, lastError as Error, {
          action: 'fetch_exhausted',
          retries
        });
      }
    }
  }

  throw lastError || new FetchError('Unknown fetch error');
}

// Helpers para métodos HTTP comuns
export const api = {
  async get<T = unknown>(url: string, options?: FetchOptions): Promise<T> {
    return resilientFetch<T>(url, { ...options, method: 'GET' });
  },

  async post<T = unknown>(url: string, data?: unknown, options?: FetchOptions): Promise<T> {
    return resilientFetch<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async put<T = unknown>(url: string, data?: unknown, options?: FetchOptions): Promise<T> {
    return resilientFetch<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async delete<T = unknown>(url: string, options?: FetchOptions): Promise<T> {
    return resilientFetch<T>(url, { ...options, method: 'DELETE' });
  },
};

export { getCircuitState, isCircuitOpen, recordSuccess, recordFailure };
