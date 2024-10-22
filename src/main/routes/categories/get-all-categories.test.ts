import request from 'supertest'
import app from '../../config/app'
import { NextFunction } from 'express'
import { PgHelper } from '../../../infra/usecases/db/postgres/helpers/pg-helper'
import { TestPoolConfig } from '../../../infra/usecases/db/postgres/test/pg-pool-config'

jest.mock(
  '../../adapters/middleware-adapter',
  () => () => async (req: Request, res: Response, next: NextFunction) => next()
)

describe('GetAllCategoriesRoutes', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig).then(() => {})
  })
  afterAll(async () => {
    PgHelper.disconnect().then(() => {})
  })
  it('Should return 200 on succeed', async () => {
    await request(app).get('/api/categories').expect(200)
  })
})
