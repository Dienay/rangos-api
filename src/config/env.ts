import dotenv from 'dotenv';

// Load environment variables from a '.env' file into 'process.env'
dotenv.config();

// Destructure environment variables from 'process.env'
const { NODE_ENV, MONGO_URL, REDIS_URL, PORT, SECRET } = process.env;

// Define an object 'env' containing the parsed environment variables
const env = {
  // Convert NODE_ENV to string
  nodeEnv: String(NODE_ENV),
  // Convert MONGO_URI to string
  url: String(MONGO_URL) || 'mongodb://rangos-mongo:27017/rangos',
  redisUrl: String(REDIS_URL) || 'redis://rangos-redis-server:6379',
  // Convert PORT to number
  port: Number(PORT) || 3003,
  secret: String(SECRET)
};

export default env;
