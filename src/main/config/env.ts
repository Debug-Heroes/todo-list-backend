import * as env from 'dotenv'
env.config()

export default {
  SERVER_PORT: Number(process.env.SERVER_PORT),
  PG_PORT: Number(process.env.PG_PORT),
  PG_PASSWORD: process.env.DATABASE_PASSWORD,
  PG_USER: process.env.DATABASE_USER,
  PG_HOST: process.env.PG_HOST,
  PG_DATABASE: process.env.DATABASE_NAME,
  JWT_SECRET: process.env.JWT_SECRET || 'any_secret'
}
