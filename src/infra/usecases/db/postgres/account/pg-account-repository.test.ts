import { IAddAccountModel } from "../../../../../domain/usecases/users/add-account"
import { PgHelper } from '../helpers/pg-helper'
import { TestPoolConfig } from '../test/pg-pool-config'
import { PgAccountRepository } from './pg-account-repository'

const makeFakeRequest = (): IAddAccountModel => ({
  email: 'any_mail@mail.com',
  password: 'any_password',
  name: 'any_name'
})

describe('PgAccountRepository', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig)
    return
  })
  beforeEach(async () => {
    PgHelper.query('DELETE FROM users')
    return
  })
  afterAll(async () => {
    PgHelper.disconnect()
    return
  })
  it('Should return an account', async () => {
    const sut = new PgAccountRepository()
    const account = await sut.add(makeFakeRequest())
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(makeFakeRequest().name)
  })
})