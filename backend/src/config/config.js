import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  host: process.env.HOST,
  db_url: process.env.DATABASE_URL,
};
export default config;