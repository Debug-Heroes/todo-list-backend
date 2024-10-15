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
  describe('add', () => {

    it('Should return an account', async () => {
      const sut = new PgAccountRepository()
      const account = await sut.add(makeFakeRequest())
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(makeFakeRequest().name)
    })
    it('Should throw if pg throws', async () => {
      const sut = new PgAccountRepository()
      jest.spyOn(PgHelper, 'query').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.add(makeFakeRequest())
      expect(promise).rejects.toThrow()
    })
    
  })
  describe('load', () => {
    it('Should call query with correct values', async () => {
      const sut = new PgAccountRepository()
      const querySpy = jest.spyOn(PgHelper, 'query')
      await sut.load('any_mail@mail.com')
      expect(querySpy).toHaveBeenCalledWith(expect.anything(), ['any_mail@mail.com'])
    })
  })
})