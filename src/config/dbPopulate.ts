// Import required modules
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import './module-alias';
import { IEstablishment } from '@/models/Establishment';
import { IProduct } from '@/models/Product';
import { logger, env } from '@/config';
import { Establishment, Product } from '@/models/index';
import Order, { IOrder } from '@/models/Order';

// Function to read JSON data from a file
const getJsonData = <T>(fileName: string): T[] => {
  // Construct file path
  const filePath = path.join(__dirname, 'data', `${fileName}.json`);
  // Read and parse JSON data
  const fileData: T[] = JSON.parse(fs.readFileSync(filePath, 'utf8')) as T[];
  return fileData;
};

// Read data from JSON files
const establishmentsData = getJsonData<IEstablishment>('establishments');
const productData = getJsonData<IProduct>('products');
const orderData = getJsonData<IOrder>('orders');

// Function to populate establishments in the database
async function populateEstablishments(establishments: IEstablishment[]): Promise<void> {
  try {
    // Clear existing establishments
    await Establishment.deleteMany({});
    // Insert new establishments
    const result = await Establishment.insertMany(establishments);
    logger.info(`Establishments populated successfully: ${result.length} establishments inserted.`);
  } catch (error) {
    logger.error('Error populating establishments:', error);
    throw error;
  }
}

// Function to populate products in the database
async function populateProducts(products: IProduct[]): Promise<void> {
  try {
    // Clear existing products
    await Product.deleteMany({});
    // Insert new products
    const result = await Product.insertMany(products);
    logger.info(`Products populated successfully: ${result.length} products inserted.`);
  } catch (error) {
    logger.error('Error populating products:', error);
    throw error;
  }
}

// Function to populate orders in the database
async function populateOrders(orders: IOrder[]): Promise<void> {
  try {
    // Clear existing orders
    await Order.deleteMany({});
    // Insert new orders
    const result = await Order.insertMany(orders);
    logger.info(`Orders populated successfully: ${result.length} orders inserted.`);
  } catch (error) {
    logger.error('Error populating orders:', error);
    throw error;
  }
}

// Function to populate the database with establishments and products
async function populateDataBase(
  establishments: IEstablishment[],
  products: IProduct[],
  orders: IOrder[]
): Promise<void> {
  try {
    const { uri } = env;

    // Connect to MongoDB
    await mongoose.connect(uri);
    logger.info('You successfully connected to MongoDB!');

    // Populate database with establishments and products
    await Promise.all([
      populateEstablishments(establishments),
      populateProducts(products),
      populateOrders(orders)
    ]);

    logger.info('Database population completed successfully.');
  } catch (error) {
    logger.error('Error:', error);
    throw error;
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB.');
  }
}

// Call the function to populate the database with data
populateDataBase(establishmentsData, productData, orderData).catch((error) => {
  logger.error('Error populating database:', error);
});
