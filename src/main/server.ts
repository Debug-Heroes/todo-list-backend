import { PgHelper } from '../infra/usecases/db/postgres/helpers/pg-helper'
import app from './config/app'
import env from './config/env'
import { PoolConfig } from './config/pool-config'

PgHelper.connect(PoolConfig).then(() => {
  app.listen(env.SERVER_PORT, () => {
    console.log(`App is running in ${env.SERVER_PORT}. 👾`)
  })
})
