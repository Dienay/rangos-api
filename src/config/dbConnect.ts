import mongoose from 'mongoose';
import env from './env';
import logger from './logger';

const { url } = env;

async function run() {
  try {
    await mongoose.connect(url);

    logger.info('You successfully connected to MongoDB!');

    return mongoose.connection;
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default run;
