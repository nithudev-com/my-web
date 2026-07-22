import { getRedis } from './redis';
import crypto from 'crypto';

export async function rateLimit(identifier: string, limit: number, windowSecs: number): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const redis = getRedis();
  
  // If redis is not configured, we just pass the request. 
  // In a strict production environment, this could throw, but we fallback gracefully here.
  if (!redis) {
    return { success: true, limit, remaining: limit, reset: Date.now() + windowSecs * 1000 };
  }

  const key = `rate-limit:${identifier}`;
  const now = Date.now();
  
  const multi = redis.multi();
  multi.zremrangebyscore(key, 0, now - windowSecs * 1000);
  multi.zadd(key, now, `${now}-${crypto.randomBytes(4).toString('hex')}`);
  multi.zcard(key);
  multi.expire(key, windowSecs);
  
  const results = await multi.exec();
  if (!results) {
    return { success: true, limit, remaining: limit, reset: now + windowSecs * 1000 };
  }
  
  const count = results[2][1] as number;
  
  return {
    success: count <= limit,
    limit,
    remaining: Math.max(0, limit - count),
    reset: now + windowSecs * 1000
  };
}
