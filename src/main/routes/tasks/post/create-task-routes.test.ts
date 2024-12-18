import { PgHelper } from '@infra/usecases/db/postgres/helpers/pg-helper'
import { TestPoolConfig } from '@infra/usecases/db/postgres/test/pg-pool-config'
import app from '@main/config/app'
import { NextFunction } from 'express'
import request from 'supertest'

jest.mock('../../../adapters/middleware-adapter', () => () => async (req: any, res: any, next: NextFunction) => {
  req.user = 'any_id'
  next()
})

describe('CreateTaskRoute', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig)
    return
  })
  beforeEach(async () => {
    await PgHelper.query('DELETE FROM sch_todo_list.tasks')
    await PgHelper.query('DELETE FROM sch_todo_list.users')
    return
  })
  afterEach(async () => {
    await PgHelper.query('DELETE FROM sch_todo_list.tasks')
    await PgHelper.query('DELETE FROM sch_todo_list.users')
    return
  })
  afterAll(async () => {
    PgHelper.disconnect()
    return
  })
  it('Should return 200 on succeed', async () => {
    await PgHelper.query('INSERT INTO sch_todo_list.users VALUES($1, $2, $3, $4)', [
      'any_user',
      'any_name',
      'any_mail@mail.com',
      'any_password'
    ])
    await request(app)
      .post('/api/tasks')
      .send({
        name: 'any_name',
        text: 'any_text',
        userId: 'any_user'
      })
      .expect(201)
  })
})