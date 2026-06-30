import IORedis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: IORedis };

export function getRedis() {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!globalForRedis.redis) {
    globalForRedis.redis = new IORedis(url, {
      maxRetriesPerRequest: null
    });
  }

  return globalForRedis.redis;
}
