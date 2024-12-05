import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,  
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: 5432,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
});
