 
import { Pool, QueryResult } from 'pg'

type PgPoolConfig = {
  user: string
  host: string
  database: string
  password: string
  port: number
}

export const PgHelper = {
  client: null as unknown as Pool,
  connect: async function (config: PgPoolConfig) {
    this.client = new Pool(config)
    await this.client.connect()
  },
  disconnect: async function () {
    await this.client.end()
  },
  query: async function (queryString: string, queryParameters?: Array<any>): Promise<QueryResult<any>> {
    const result = await this.client.query(queryString, queryParameters)
    return result
  }
}