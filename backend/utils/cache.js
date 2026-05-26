const fs = require('fs');
const path = require('path');
const redisUrl = process.env.REDIS_URL;
let redisClient;
let useRedis = false;
const localCache = new Map();
const defaultTTL = Number(process.env.CACHE_TTL_SECONDS) || 60;

async function initCache() {
  if (!redisUrl) {
    return;
  }

  try {
    const { createClient } = require('redis');
    redisClient = createClient({ url: redisUrl });
    redisClient.on('error', (err) => console.error('Redis cache error:', err));
    await redisClient.connect();
    useRedis = true;
    console.log('✓ Redis cache connected');
  } catch (error) {
    console.warn('⚠️ Redis cache initialization failed; falling back to in-memory cache.', error.message);
    useRedis = false;
  }
}

function normalizeValue(value) {
  return JSON.stringify(value);
}

function parseValue(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}

async function getCache(key) {
  if (useRedis && redisClient) {
    const result = await redisClient.get(key);
    return result ? parseValue(result) : null;
  }

  const cacheItem = localCache.get(key);
  if (!cacheItem) {
    return null;
  }

  if (cacheItem.expiresAt < Date.now()) {
    localCache.delete(key);
    return null;
  }

  return cacheItem.value;
}

async function setCache(key, value, ttl = defaultTTL) {
  if (useRedis && redisClient) {
    await redisClient.set(key, normalizeValue(value), { EX: ttl });
    return;
  }

  localCache.set(key, {
    value,
    expiresAt: Date.now() + ttl * 1000,
  });
}

async function delCache(key) {
  if (useRedis && redisClient) {
    await redisClient.del(key);
    return;
  }

  localCache.delete(key);
}

async function clearCache() {
  if (useRedis && redisClient) {
    await redisClient.flushAll();
    return;
  }

  localCache.clear();
}

function cleanupLocalCache() {
  const now = Date.now();
  for (const [key, entry] of localCache.entries()) {
    if (entry.expiresAt <= now) {
      localCache.delete(key);
    }
  }
}

function cacheMiddleware(prefixes = ['/api/meditations', '/api/sounds', '/api/content', '/api/landing', '/api/marketplace', '/api/success-stories', '/api/wellness-retreats']) {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const shouldCache = prefixes.some((prefix) => req.path.startsWith(prefix));
    if (!shouldCache || req.headers.authorization || req.headers.cookie) {
      return next();
    }

    const key = `cache:${req.method}:${req.originalUrl}`;
    try {
      const cached = await getCache(key);
      if (cached) {
        return res.status(200).json(cached);
      }
    } catch (err) {
      console.warn('Cache read error:', err.message);
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      try {
        await setCache(key, body);
      } catch (err) {
        console.warn('Cache write error:', err.message);
      }
      return originalJson(body);
    };

    return next();
  };
}

// Ensure periodic cleanup for in-memory cache entries
setInterval(cleanupLocalCache, 60 * 1000);

module.exports = {
  initCache,
  getCache,
  setCache,
  delCache,
  clearCache,
  cacheMiddleware,
};
