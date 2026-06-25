import dotenv from 'dotenv';

dotenv.config();

const { NODE_ENV, MONGO_URL, REDIS_URL, PORT, SECRET } = process.env;

const env = {
  nodeEnv: String(NODE_ENV),
  url: String(MONGO_URL) || 'mongodb://rangos-mongo:27017/rangos',
  redisUrl: String(REDIS_URL) || 'redis://rangos-redis-server:6379',
  port: Number(PORT) || 3003,
  secret: String(SECRET)
};

export default env;
