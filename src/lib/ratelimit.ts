import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

export const checkRateLimit = async (identifier: string) => {
  // If no env vars are set, skip rate limiting (dev mode or missing config)
  if (!process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL === 'mock_url') {
    return { success: true, limit: 10, remaining: 10, reset: 0 };
  }

  try {
    return await ratelimit.limit(identifier);
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open if redis is down
    return { success: true, limit: 10, remaining: 10, reset: 0 };
  }
};
