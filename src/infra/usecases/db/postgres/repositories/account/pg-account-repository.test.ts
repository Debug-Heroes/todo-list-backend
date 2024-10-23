import { IAddAccountModel } from '../../../../../../domain/usecases/users/add-account'
import { UpdateAccountModel } from '../../../../../../domain/usecases/users/update-account'
import { PgHelper } from '../../helpers/pg-helper'
import { TestPoolConfig } from '../../test/pg-pool-config'
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
      expect(querySpy).toHaveBeenCalledWith(expect.anything(), [
        'any_mail@mail.com'
      ])
    })
    it('Should return an account on succeed', async () => {
      await PgHelper.query(
        'INSERT INTO users(name, email, password) VALUES($1, $2, $3)',
        ['any_name', 'any_mail@mail.com', 'any_password']
      )
      const sut = new PgAccountRepository()
      const result = await sut.load('any_mail@mail.com')
      expect(result?.id).toBeTruthy()
      expect(result?.email).toBe('any_mail@mail.com')
    })
    it('Should throw if pg throws', async () => {
      const sut = new PgAccountRepository()
      jest.spyOn(PgHelper, 'query').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.load('any_mail@mail.com')
      expect(promise).rejects.toThrow()
    })
    it('Should not return if pg fails', async () => {
      const sut = new PgAccountRepository()
      const result = await sut.load('inexistent_mail@mail.com')
      expect(result).toBeFalsy()
    })
  })
  describe('delete', () => {
    it('Should call query with correct values', async () => {
      const sut = new PgAccountRepository()
      const querySpy = jest.spyOn(PgHelper, 'query')
      await sut.delete('any_id')
      expect(querySpy).toHaveBeenCalledWith(expect.anything(), ['any_id'])
    })
    it('Should throw if query throws', async () => {
      const sut = new PgAccountRepository()
      jest.spyOn(PgHelper, 'query').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.delete('any_id')
      expect(promise).rejects.toThrow()
    })
    it('Should return rowCount on query succeed', async () => {
      await PgHelper.query('INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4)', ['any_id', 'any_name', 'any_mail@mail.com', 'any_password'])
      const sut = new PgAccountRepository()
      const rows = await sut.delete('any_id')
      expect(rows).toBe(`1 affected rows`)
    })
    it('Should return rowCount on query fails', async () => {
      const sut = new PgAccountRepository()
      const rows = await sut.delete('any_id')
      expect(rows).toBe(`0 affected rows`)
    })
  })
  describe('loadById', () => {
    it('Should call query with correct values', async () => {
      const sut = new PgAccountRepository()
      const querySpy = jest.spyOn(PgHelper, 'query')
      await sut.loadById('any_id')
      expect(querySpy).toHaveBeenCalledWith(expect.anything(), ['any_id'])
    })
    it('Should throw if query throws', async () => {
      const sut = new PgAccountRepository()
      jest.spyOn(PgHelper, 'query').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.loadById('any_id')
      expect(promise).rejects.toThrow()
    })
    it('Should return an account if query succeed', async () => {
      PgHelper.query('INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *', ['any_name', 'any_mail@mail.com', 'any_password']).then(async (user) => {
        const sut = new PgAccountRepository()
        const account = await sut.loadById(user.rows[0].id)
        expect(account?.email).toBe('any_mail@mail.com')
        expect(account?.name).toBe('any_name')
      })
    })
    it('Should not return if query fails', async () => {
      const sut = new PgAccountRepository()
      const account = await sut.loadById('any_id')
      expect(account).toBeFalsy()
    })
  })
  describe('update', () => {
    const makeFakeRequest = (): UpdateAccountModel => ({
      id: 'any_id',
      email: 'any_mail'
    })
    it('Should call query with correct values', async () => {
      const sut = new PgAccountRepository()
      const querySpy = jest.spyOn(PgHelper, 'query')
      await sut.update(makeFakeRequest())
      expect(querySpy).toHaveBeenCalledWith('UPDATE users SET email = $1 WHERE id = $2 RETURNING *', ['any_mail', 'any_id'])
    })
    it('Should throw if query throws', async () => {
      const sut = new PgAccountRepository()
      jest.spyOn(PgHelper, 'query').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.update(makeFakeRequest())
      expect(promise).rejects.toThrow()
    })
    it('Should return an account on query succeed', async () => {
      await PgHelper.query('INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4)', ['any_id', 'any_name', 'any_mail@mail.com', 'any_password'])
      const sut = new PgAccountRepository()
      const result = await sut.update(makeFakeRequest())
      expect(result.email).toBe('any_mail')
      expect(result.name).toBe('any_name')
      expect(result.id).toBeTruthy()
    })
  })
})