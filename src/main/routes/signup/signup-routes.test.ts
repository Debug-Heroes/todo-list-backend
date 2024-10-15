import request from 'supertest'
import { PgHelper } from '../../../infra/usecases/db/postgres/helpers/pg-helper'
import { TestPoolConfig } from '../../../infra/usecases/db/postgres/test/pg-pool-config'
import app from '../../config/app'
import { hash } from 'bcrypt'

const salt = 12
describe('SignUp Routes', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig).then(() => {})
    await PgHelper.query('INSERT INTO users(name, email, password) VALUES($1, $2, $3)', ['any_name', 'any_email@mail.com', await hash('any_password', salt)]).then(() => {})
  })

  beforeEach(async () => {
    await PgHelper.query('DELETE FROM users')
  })
  
  afterAll(async () => {
    await PgHelper.query('DELETE FROM users')
    PgHelper.disconnect().then(() => {})
  })

  it('Should return 200 on call login route with correct values', async () => {
    await request(app)
      .post('/sign')
      .send({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      })
      .expect(200)
  })
})