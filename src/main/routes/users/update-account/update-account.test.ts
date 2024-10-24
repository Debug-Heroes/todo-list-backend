import { NextFunction } from 'express'
import { PgHelper } from '../../../../infra/usecases/db/postgres/helpers/pg-helper'
import { TestPoolConfig } from '../../../../infra/usecases/db/postgres/test/pg-pool-config'
import app from '../../../config/app'
import request from 'supertest'

jest.mock(
  '../../../adapters/middleware-adapter',
  () => () => async (req: any, res: any, next: NextFunction) => {
    req.user = 'any_id'
    next()
  }
)

describe('UpdateAccountRoute', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig)
    await PgHelper.query('INSERT INTO users VALUES($1, $2, $3, $4)', [
      'any_id',
      'any_name',
      'any_mail@mail.com',
      'any_password'
    ])
    return
  })
  afterAll(async () => {
    PgHelper.disconnect()
    return
  })
  it('Should return 200 on succeed', async () => {
    await request(app)
      .patch('/user')
      .send({
        id: 'any_id',
        email: 'any_mail@mail.com'
      })
      .expect(200)
  })
})
