import bcrypt from 'bcrypt';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import env from './env';
import logger from './logger';
import { IEstablishment } from '../models/Establishment';
import { IProduct } from '../models/Product';
import { Establishment, Product } from '../models/index';
import User, { IUser } from '../models/User';
import Order, { IOrder } from '../models/Order';

const getJsonData = <T>(fileName: string): T[] => {
  const filePath = path.join(__dirname, 'data', `${fileName}.json`);
  const fileData: T[] = JSON.parse(fs.readFileSync(filePath, 'utf8')) as T[];
  return fileData;
};

const establishmentsData = getJsonData<IEstablishment>('establishments');
const productData = getJsonData<IProduct>('products');
const userData = getJsonData<IUser>('users');
const orderData = getJsonData<IOrder>('orders');

async function populateEstablishments(establishments: IEstablishment[]): Promise<void> {
  try {
    await Establishment.deleteMany({});
    const result = await Establishment.insertMany(establishments);
    logger.info(`Establishments populated successfully: ${result.length} establishments inserted.`);
  } catch (error) {
    logger.error('Error populating establishments:', error);
    throw error;
  }
}

async function populateProducts(products: IProduct[]): Promise<void> {
  try {
    await Product.deleteMany({});
    const result = await Product.insertMany(products);
    logger.info(`Products populated successfully: ${result.length} products inserted.`);
  } catch (error) {
    logger.error('Error populating products:', error);
    throw error;
  }
}

async function populateUsers(users: IUser[]): Promise<void> {
  try {
    await User.deleteMany({});

    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(user.password, salt);
        return { ...user, password: passwordHash };
      })
    );

    const result = await User.insertMany(usersWithHashedPasswords);
    logger.info(`Users populated successfully: ${result.length} users inserted.`);
  } catch (error) {
    logger.error('Error populating users:', error);
    throw error;
  }
}

async function populateOrders(orders: IOrder[]): Promise<void> {
  try {
    await Order.deleteMany({});
    const result = await Order.insertMany(orders);
    logger.info(`Orders populated successfully: ${result.length} orders inserted.`);
  } catch (error) {
    logger.error('Error populating orders:', error);
    throw error;
  }
}

async function populateDataBase(
  establishments: IEstablishment[],
  products: IProduct[],
  users: IUser[],
  orders: IOrder[]
): Promise<void> {
  try {
    const { url } = env;

    await mongoose.connect(url);
    logger.info('You successfully connected to MongoDB!');

    await Promise.all([
      populateEstablishments(establishments),
      populateProducts(products),
      populateUsers(users),
      populateOrders(orders)
    ]);

    logger.info('Database population completed successfully.');
  } catch (error) {
    logger.error('Error:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB.');
  }
}

populateDataBase(establishmentsData, productData, userData, orderData).catch((error) => {
  logger.error('Error populating database:', error);
});
