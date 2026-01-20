/**
 * Rate Limiting Middleware
 *
 * Implementação de rate limiting para APIs.
 * Suporta:
 * - Upstash Redis (produção)
 * - In-memory (desenvolvimento)
 * - Configuração por rota
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

interface RateLimitConfig {
  // Número máximo de requests
  limit: number;
  // Janela de tempo em segundos
  window: number;
  // Identificador customizado (default: IP)
  identifier?: (req: NextRequest) => string;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// Cache in-memory para desenvolvimento
const memoryCache = new Map<string, { count: number; resetTime: number }>();

// Configurações padrão por tipo de rota
export const rateLimitConfigs = {
  // APIs públicas - mais restritivo
  public: {
    limit: 60,
    window: 60, // 60 req/min
  },
  // APIs de autenticação - muito restritivo
  auth: {
    limit: 10,
    window: 60, // 10 req/min
  },
  // APIs protegidas (admin) - mais permissivo
  protected: {
    limit: 120,
    window: 60, // 120 req/min
  },
  // Webhooks - muito permissivo
  webhook: {
    limit: 1000,
    window: 60, // 1000 req/min
  },
} as const;

/**
 * Extrai IP do request
 */
function getIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return '127.0.0.1';
}

/**
 * Rate limit usando memória (desenvolvimento)
 */
function rateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `rl:${identifier}`;
  const windowMs = config.window * 1000;

  let entry = memoryCache.get(key);

  // Se não existe ou expirou, cria nova entrada
  if (!entry || now >= entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  entry.count++;
  memoryCache.set(key, entry);

  const remaining = Math.max(0, config.limit - entry.count);
  const success = entry.count <= config.limit;

  return {
    success,
    limit: config.limit,
    remaining,
    reset: Math.ceil(entry.resetTime / 1000),
  };
}

/**
 * Rate limit usando Upstash Redis (produção)
 */
async function rateLimitUpstash(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    logger.warn('Upstash not configured, falling back to memory', {
      action: 'rate_limit_fallback'
    });
    return rateLimitMemory(identifier, config);
  }

  try {
    // Usa sliding window com Redis
    const key = `rl:${identifier}`;
    const now = Date.now();
    const windowStart = now - (config.window * 1000);

    // Remove entradas antigas e adiciona nova
    const pipeline = [
      ['ZREMRANGEBYSCORE', key, '0', String(windowStart)],
      ['ZADD', key, String(now), String(now)],
      ['ZCARD', key],
      ['EXPIRE', key, String(config.window)],
    ];

    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipeline),
    });

    if (!response.ok) {
      throw new Error(`Upstash error: ${response.status}`);
    }

    const results = await response.json();
    const count = results[2]?.result || 0;

    const remaining = Math.max(0, config.limit - count);
    const success = count <= config.limit;

    return {
      success,
      limit: config.limit,
      remaining,
      reset: Math.ceil((now + config.window * 1000) / 1000),
    };
  } catch (error) {
    logger.error('Upstash rate limit error', error as Error, {
      action: 'rate_limit_error'
    });
    // Fallback para memória em caso de erro
    return rateLimitMemory(identifier, config);
  }
}

/**
 * Aplica rate limiting a um request
 */
export async function rateLimit(
  req: NextRequest,
  config: RateLimitConfig = rateLimitConfigs.public
): Promise<RateLimitResult> {
  const identifier = config.identifier
    ? config.identifier(req)
    : getIP(req);

  const result = process.env.UPSTASH_REDIS_REST_URL
    ? await rateLimitUpstash(identifier, config)
    : rateLimitMemory(identifier, config);

  if (!result.success) {
    logger.warn('Rate limit exceeded', {
      action: 'rate_limit_exceeded',
      identifier,
      limit: config.limit,
      window: config.window,
    });
  }

  return result;
}

/**
 * Cria response de rate limit excedido
 */
export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: result.reset - Math.floor(Date.now() / 1000),
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
        'Retry-After': String(result.reset - Math.floor(Date.now() / 1000)),
      },
    }
  );
}

/**
 * Adiciona headers de rate limit na response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set('X-RateLimit-Reset', String(result.reset));
  return response;
}

/**
 * Middleware helper para rate limiting
 */
export function withRateLimit(config?: RateLimitConfig) {
  return async function rateLimitMiddleware(
    req: NextRequest,
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    const result = await rateLimit(req, config);

    if (!result.success) {
      return rateLimitResponse(result);
    }

    const response = await handler();
    return addRateLimitHeaders(response, result);
  };
}

// Limpa cache de memória periodicamente (apenas em dev)
if (typeof globalThis !== 'undefined' && process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const now = Date.now();
    let cleared = 0;

    for (const [key, value] of memoryCache.entries()) {
      if (now >= value.resetTime) {
        memoryCache.delete(key);
        cleared++;
      }
    }

    if (cleared > 0) {
      logger.debug(`Rate limit cache cleanup: ${cleared} entries`, {
        action: 'rate_limit_cleanup'
      });
    }
  }, 60000); // A cada minuto
}

export type { RateLimitConfig, RateLimitResult };
