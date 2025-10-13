import { createClient } from 'redis';
import Order, { TopProduct } from 'src/models/Order';
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
      logger.error('Redis error:', error.message);
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
          coverPhoto: '$product.coverPhoto',
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
