import { PgPoolConfig } from "../../infra/usecases/db/postgres/helpers/pg-helper";
import env from "./env";

export const PoolConfig: PgPoolConfig = {
  database: env.PG_DATABASE || 'postgres',
  host: env.PG_HOST || 'localhost',
  password: env.PG_PASSWORD || 'any_password',
  port: env.PG_PORT || 5432,
  user: env.PG_USER || 'postgres'
}