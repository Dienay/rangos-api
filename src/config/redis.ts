import { createClient } from 'redis';
import Order from 'src/models/Order';
import { TopProduct } from 'src/models/Product';
import mongoose from 'mongoose';
import env from './env';
import logger from './logger';

let redisAvailable = false;
let redisClient: ReturnType<typeof createClient> | null = null;

export async function initRedis() {
  const { redisUrl } = env;

  if (!redisUrl || redisUrl.trim() === '') {
    logger.warn('No Redis URL configured, skipping Redis connection');
    redisAvailable = false;
    return;
  }

  try {
    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 3000,
        reconnectStrategy: () => false
      }
    });

    redisClient.on('error', (error: Error) => {
      logger.debug('Redis error:', error.message);
      redisAvailable = false;
    });

    await redisClient.connect();
    redisAvailable = true;
    logger.info('Redis connected successfully.');
  } catch (error) {
    redisAvailable = false;
    redisClient = null;
    logger.info('Could not connect to Redis, using MongoDB only');
  }
}

async function clearRedisCacheOnExit() {
  if (redisAvailable && redisClient && redisClient.isOpen) {
    try {
      await redisClient.del('top-products'); // Limpa o cache do top-products
      logger.info('Cache Redis limpo antes da parada.');
    } catch (err) {
      logger.error('Erro ao limpar cache Redis:', err);
    }
  }
}

// Registrando eventos do processo para limpar cache e encerrar
process.on('exit', async () => {
  await clearRedisCacheOnExit();
});
process.on('SIGINT', async () => {
  await clearRedisCacheOnExit();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await clearRedisCacheOnExit();
  process.exit(0);
});
process.on('uncaughtException', async (err) => {
  logger.error('Uncaught exception:', err);
  await clearRedisCacheOnExit();
  process.exit(1);
});

export async function fetchTopProductsFromMongo(): Promise<TopProduct[]> {
  try {
    const pipeline: mongoose.PipelineStage[] = [
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          totalSales: { $sum: '$products.quantity' }
        }
      },
      { $sort: { totalSales: -1 as 1 | -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          price: '$product.price',
          productImage: '$product.productImage',
          totalSales: 1
        }
      }
    ];

    const topProducts: TopProduct[] = await Order.aggregate<TopProduct>(pipeline);

    return topProducts;
  } catch (error) {
    logger.error('Error fetching top products from Mongo:', error);
    return [];
  }
}

export async function getTopProducts(): Promise<TopProduct[]> {
  const cacheKey = 'top-products';

  if (redisAvailable && redisClient?.isOpen) {
    try {
      const cacheData = await redisClient.get(cacheKey);
      if (cacheData) {
        logger.info('Returning Top Products from Redis cache.');
        return JSON.parse(cacheData) as TopProduct[];
      }
    } catch (error) {
      logger.warn('Redis get failed — skipping cache:', error);
    }
  }

  const topProducts = await fetchTopProductsFromMongo();

  if (redisAvailable && redisClient?.isOpen) {
    try {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(topProducts));
      logger.info('Cached Top Products in Redis.');
    } catch (error) {
      logger.error('Error setting cache in Redis:', error);
    }
  }

  return topProducts;
}
