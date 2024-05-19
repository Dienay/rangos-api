import dotenv from 'dotenv';

dotenv.config();

const { NODE_ENV, PORT } = process.env;

const env = {
  nodeEnv: String(NODE_ENV),
  port: Number(PORT)
};

export default env;
