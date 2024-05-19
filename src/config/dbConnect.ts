import mongoose from 'mongoose';
import 'dotenv/config';
import logger from './logger';

const { URI } = process.env;

const uri: string = URI || 'localhost';

async function run() {
  try {
    await mongoose.connect(uri);

    logger.info('You successfully connected to MongoDB!');

    return mongoose.connection;
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default run;
