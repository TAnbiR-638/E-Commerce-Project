import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis connected successfully.'));

// Connect the client immediately
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();
