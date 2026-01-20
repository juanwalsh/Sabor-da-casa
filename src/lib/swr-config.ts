/**
 * Configuração Avançada do SWR
 *
 * Features:
 * - Retry inteligente com backoff
 * - Cache com invalidação seletiva
 * - Prefetch automático
 * - Deduplicação de requests
 * - Error handling global
 */

import { SWRConfiguration, Cache, State } from 'swr';
import { logger } from './logger';
import { resilientFetch } from './fetch-client';

// Cache customizado com TTL e invalidação
interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SmartCache implements Cache {
  private cache: Map<string, CacheEntry<State<unknown, unknown>>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutos

  get<T>(key: string): State<T, unknown> | undefined {
    const entry = this.cache.get(key);

    if (!entry) return undefined;

    // Verifica se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      logger.debug(`Cache expired for ${key}`, { action: 'cache_expired' });
      return undefined;
    }

    return entry.data as State<T, unknown>;
  }

  set<T>(key: string, value: State<T, unknown>): void {
    this.cache.set(key, {
      data: value as State<unknown, unknown>,
      timestamp: Date.now(),
      ttl: this.getTTLForKey(key),
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  keys(): IterableIterator<string> {
    return this.cache.keys();
  }

  // TTL diferente por tipo de dado
  private getTTLForKey(key: string): number {
    if (key.includes('/api/products')) {
      return 10 * 60 * 1000; // Produtos: 10 min
    }
    if (key.includes('/api/orders')) {
      return 30 * 1000; // Pedidos: 30 seg (mais dinâmico)
    }
    if (key.includes('/api/settings')) {
      return 30 * 60 * 1000; // Configurações: 30 min
    }
    return this.defaultTTL;
  }

  // Invalida cache por padrão
  invalidatePattern(pattern: string | RegExp): number {
    let count = 0;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    logger.info(`Cache invalidated: ${count} entries`, {
      action: 'cache_invalidate',
      pattern: pattern.toString()
    });

    return count;
  }

  // Limpa todo o cache
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    logger.info(`Cache cleared: ${size} entries`, { action: 'cache_clear' });
  }

  // Stats do cache
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Instância global do cache
export const smartCache = new SmartCache();

// Fetcher padrão com retry
const defaultFetcher = async <T>(url: string): Promise<T> => {
  const endTiming = logger.time(`SWR fetch ${url}`);

  try {
    const data = await resilientFetch<T>(url, {
      retries: 2,
      timeout: 8000,
    });
    endTiming();
    return data;
  } catch (error) {
    logger.error(`SWR fetch failed: ${url}`, error as Error, {
      action: 'swr_fetch_error'
    });
    throw error;
  }
};

// Handler global de erros
const onError = (error: Error, key: string): void => {
  logger.error(`SWR error for ${key}`, error, {
    action: 'swr_error',
    key
  });
};

// Handler de sucesso para logging
const onSuccess = (data: unknown, key: string): void => {
  logger.debug(`SWR success for ${key}`, {
    action: 'swr_success',
    key,
    hasData: !!data
  });
};

// Configuração global do SWR
export const swrConfig: SWRConfiguration = {
  fetcher: defaultFetcher,
  provider: () => smartCache,
  onError,
  onSuccess,

  // Retry
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    // Não faz retry para 404
    if ((error as { status?: number }).status === 404) return;

    // Máximo de 3 retries
    if (retryCount >= 3) return;

    // Backoff exponencial
    const delay = Math.min(1000 * 2 ** retryCount, 30000);

    logger.debug(`SWR retry ${retryCount + 1} for ${key}`, {
      action: 'swr_retry',
      delay
    });

    setTimeout(() => revalidate({ retryCount }), delay);
  },

  // Revalidação
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  revalidateIfStale: true,

  // Deduplicação
  dedupingInterval: 2000,

  // Focus throttling
  focusThrottleInterval: 5000,

  // Loading state
  loadingTimeout: 3000,

  // Keep previous data while revalidating
  keepPreviousData: true,
};

// Helpers para invalidação de cache
export const cacheHelpers = {
  // Invalida cache de produtos
  invalidateProducts(): void {
    smartCache.invalidatePattern(/\/api\/products/);
  },

  // Invalida cache de pedidos
  invalidateOrders(): void {
    smartCache.invalidatePattern(/\/api\/orders/);
  },

  // Invalida cache de um produto específico
  invalidateProduct(productId: string): void {
    smartCache.invalidatePattern(new RegExp(`/api/products.*${productId}`));
  },

  // Invalida tudo
  invalidateAll(): void {
    smartCache.clear();
  },

  // Stats
  getStats(): { size: number; keys: string[] } {
    return smartCache.getStats();
  },
};

// Prefetch helper
export async function prefetch<T>(key: string): Promise<T | null> {
  try {
    const data = await defaultFetcher<T>(key);
    logger.debug(`Prefetched ${key}`, { action: 'prefetch' });
    return data;
  } catch (error) {
    logger.warn(`Prefetch failed for ${key}`, {
      action: 'prefetch_error',
      error: (error as Error).message
    });
    return null;
  }
}

// Expõe no window para debug (apenas dev)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as unknown as Record<string, unknown>).swrCache = {
    stats: () => smartCache.getStats(),
    clear: () => smartCache.clear(),
    invalidate: (pattern: string) => smartCache.invalidatePattern(pattern),
  };
}
