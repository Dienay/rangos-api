import mongoose from "mongoose";

const { DB_HOST, DB_PORT, DB_NAME } = process.env

const uri: string = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

async function run() {
  try {
    await mongoose.connect(uri);

    console.log("You successfully connected to MongoDB!");

    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default run;

