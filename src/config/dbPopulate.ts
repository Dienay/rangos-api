/* eslint-disable no-console */
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import 'dotenv/config';
import { IEstablishment } from '@/models/Establishment';
import { IProduct } from '@/models/Product';
import { Establishment, Product } from '../models/index';

const getJsonData = <T>(fileName: string): T[] => {
  const filePath = path.join(__dirname, 'data', `${fileName}.json`);
  const fileData: T[] = JSON.parse(fs.readFileSync(filePath, 'utf8')) as T[];

  return fileData;
};

const establishmentsData = getJsonData<IEstablishment>('establishments');
const productData = getJsonData<IProduct>('products');

async function populateEstablishments(establishments: IEstablishment[]): Promise<void> {
  try {
    await Establishment.deleteMany({});
    const result = await Establishment.insertMany(establishments);
    console.log(`Establishments populated successfully: ${result.length} establishments inserted.`);
  } catch (error) {
    console.error('Error populating establishments:', error);
    throw error;
  }
}
async function populateProducts(products: IProduct[]): Promise<void> {
  try {
    await Product.deleteMany({});
    const result = await Product.insertMany(products);
    console.log(`Products populated successfully: ${result.length} products inserted.`);
  } catch (error) {
    console.error('Error populating products:', error);
    throw error;
  }
}

async function populateDataBase(establishments: IEstablishment[], products: IProduct[]): Promise<void> {
  try {
    const { URI } = process.env;
    const uri: string = URI || 'localhost';

    await mongoose.connect(uri);
    console.log('You successfully connected to MongoDB!');

    await Promise.all([populateEstablishments(establishments), populateProducts(products)]);

    console.log('Database population completed successfully.');
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

populateDataBase(establishmentsData, productData).catch((error) => {
  console.error('Error populating database:', error);
});
