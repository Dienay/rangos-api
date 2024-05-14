import mongoose from "mongoose";

const { URI } = process.env

const uri: string = URI || "localhost";

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

