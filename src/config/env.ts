import dotenv from 'dotenv';

// Load environment variables from a '.env' file into 'process.env'
dotenv.config();

const { NODE_ENV, PORT } = process.env;
// Destructure environment variables from 'process.env'

// Define an object 'env' containing the parsed environment variables
const env = {
  // Convert NODE_ENV to string
  nodeEnv: String(NODE_ENV),
  port: Number(PORT)
  // Convert PORT to number
  port: Number(PORT) || 3003
};

export default env;
