import dotenv from 'dotenv';

// Load environment variables from a '.env' file into 'process.env'
dotenv.config();

// Destructure environment variables from 'process.env'
const { NODE_ENV, URI, PORT } = process.env;

// Define an object 'env' containing the parsed environment variables
const env = {
  // Convert NODE_ENV to string
  nodeEnv: String(NODE_ENV),
  // Convert URI to string
  uri: String(URI) || 'mongodb://localhost:27017',
  // Convert PORT to number
  port: Number(PORT) || 3003
};

export default env;
