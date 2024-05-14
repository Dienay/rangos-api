import fs from 'fs';
import { establishment, product } from "../models/index";
import mongoose from 'mongoose';
import path from 'path';

interface DataItem<T> {
  model: mongoose.Model<T>;
  collectionName: string;
  collectionData: T[];
}

const getJsonData = <T>(fileName: string): T[] => {
  const filePath = path.join(__dirname, 'data', `${fileName}.json`);
  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  return fileData;
}

const establishmentsData = getJsonData('establishments');
const productData = getJsonData('products');

async function populateDataBase(data: DataItem<any>[]) {
  try {
    const { URI } = process.env

    const uri: string = URI || "localhost";

    await mongoose.connect(uri);
    console.log("You successfully connected to MongoDB!");

    for (const { model, collectionName, collectionData } of data) {
      const collectionExists = await model.collection.countDocuments();

      if (collectionExists === 0) {
        console.log(`${collectionName} collection does not exist. Creating...`);
      } else {
        await model.deleteMany();
        console.log(`Existing data in ${collectionName} collection cleared.`);
      }

      await model.insertMany(collectionData);
      console.log(`${collectionName} collection populated success.`);
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

const data: DataItem<any>[] = [
  {
    model: establishment,
    collectionName: 'Establishments',
    collectionData: establishmentsData
  },
  {
    model: product,
    collectionName: 'Products',
    collectionData: productData
  }
];

populateDataBase(data);