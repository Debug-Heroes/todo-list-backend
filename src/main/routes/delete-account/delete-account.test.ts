import { PgHelper } from '../../../infra/usecases/db/postgres/helpers/pg-helper'
import { TestPoolConfig } from '../../../infra/usecases/db/postgres/test/pg-pool-config'
import app from '../../config/app'
import request from 'supertest'

describe('DeleteAccountRoute', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig)
    return
  })
  beforeEach(async () => {
    await PgHelper.query('DELETE FROM users')
    return
  })
  afterEach(async () => {
    await PgHelper.query('DELETE FROM users')
    return
  })
  afterAll(async () => {
    PgHelper.disconnect()
    return
  })
  it('Should return 200 on succeed', async () => {
    PgHelper.query('INSERT INTO users VALUES($1, $2, $3, $4)', ['any_id', 'any_name', 'any_mail@mail.com', 'any_password']).then(async () => {
      await request(app)
      .delete('/user?id=any_id')
      .expect(200)
    })
  })
})