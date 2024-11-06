import { PgHelper } from '@infra/usecases/db/postgres/helpers/pg-helper'
import { TestPoolConfig } from '@infra/usecases/db/postgres/test/pg-pool-config'
import app from '@main/config/app'
import { NextFunction } from 'express'
import request from 'supertest'

jest.mock('../../../adapters/middleware-adapter', () => () => async (req: any, res: any, next: NextFunction) => {
  req.user = 'any_id'
  next()
})

describe('GetAllTasksRoutes', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig)
    return
  })
  beforeEach(async () => {
    await PgHelper.query('DELETE FROM tasks')
    await PgHelper.query('DELETE FROM users')
    return
  })
  afterEach(async () => {
    await PgHelper.query('DELETE FROM tasks')
    await PgHelper.query('DELETE FROM users')
    return
  })
  afterAll(async () => {
    PgHelper.disconnect()
    return
  })
  it('Should return 200 on succeed', async () => {
    await request(app)
      .get('/api/tasks')
      .expect(200)
  })
})