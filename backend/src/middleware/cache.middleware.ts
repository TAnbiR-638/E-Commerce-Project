import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../lib/redis';

/**
 * Caches the response of a route in Redis for a specified duration.
 * @param duration Duration in seconds
 */
export const cacheResponse = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedData));
      }

      res.setHeader('X-Cache', 'MISS');
      
      // Override res.json to intercept the response payload
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient.setEx(key, duration, JSON.stringify(body)).catch(err => {
            console.error('Failed to write to cache:', err);
          });
        }
        return originalJson(body);
      };
      
      next();
    } catch (err) {
      console.error('Redis cache middleware error:', err);
      // Fallback to normal flow if Redis is down
      next();
    }
  };
};

/**
 * Invalidates cache entries matching a pattern.
 */
export const invalidateCache = async (pattern: string) => {
  try {
    const keys = await redisClient.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cache invalidated for pattern: ${pattern} (${keys.length} keys)`);
    }
  } catch (err) {
    console.error('Failed to invalidate cache:', err);
  }
};
