import { createClient } from 'redis';
import env from './env';
import logger from './logger';

const redisClient = createClient({
  url: env.redisUrl || 'redis://rangos-redis-server:6379'
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

redisClient
  .connect()
  .then(() => logger.info('Redis connected'))
  .catch((err) => logger.error('Redis connection failed:', err));

export default redisClient;
