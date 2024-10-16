import { hash } from 'bcrypt'
import { PgHelper } from '../../../infra/usecases/db/postgres/helpers/pg-helper'
import { TestPoolConfig } from '../../../infra/usecases/db/postgres/test/pg-pool-config'
import request from 'supertest'
import app from '../../config/app'

const salt = 12
describe('LoginRoute', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig).then(() => {})
    await PgHelper.query(
      'INSERT INTO users(name, email, password) VALUES($1, $2, $3)',
      ['any_name', 'any_email@mail.com', await hash('any_password', salt)]
    )
  })

  afterAll(async () => {
    await PgHelper.query('DELETE FROM users')
    PgHelper.disconnect().then(() => {})
  })

  it('Should return 200 on call login route with correct values', async () => {
    await request(app)
      .post('/login')
      .send({
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      .expect(200)
  })
})
