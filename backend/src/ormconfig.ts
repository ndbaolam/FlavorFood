import 'reflect-metadata';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [path.join(__dirname, './modules/**/*.entity.{js,ts}')],
  migrations: [path.join(__dirname, 'migration/*.{js,ts}')],
  synchronize: false,
  logging: ['error', 'warn'],
});

export default dataSource;
