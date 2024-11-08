
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});
