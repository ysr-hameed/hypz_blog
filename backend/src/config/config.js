import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  host: process.env.HOST,
  db_url: process.env.DATABASE_URL,
  user_email: process.env.USER_EMAIL,
  user_password: process.env.USER_PASSWORD,
  gemini_api: process.env.GEMINI_API_KEY,
};

export default config;