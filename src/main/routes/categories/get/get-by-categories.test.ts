import request from 'supertest'
import app from '../../../config/app'
import { PgHelper } from '../../../../infra/usecases/db/postgres/helpers/pg-helper'
import { TestPoolConfig } from '../../../../infra/usecases/db/postgres/test/pg-pool-config'
import { NextFunction } from 'express'

jest.mock(
  '../../../adapters/middleware-adapter',
  () => () => async (req: Request, res: Response, next: NextFunction) => next()
)

describe('GetByRoutes', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig).then(() => {})
  })
  afterAll(async () => {
    PgHelper.disconnect().then(() => {})
  })
  it('Should return 200 on succeed', async () => {
    await PgHelper.query('INSERT INTO sch_todo_list.categories VALUES($1, $2)', ['any_id', 'any_name'])
    await request(app)
      .get('/api/categories/query?name=any_name')
      .expect(200)
  })
})