import { PgCategoriesRepository } from './pg-categories-repository'
import { PgHelper } from '../../helpers/pg-helper'
import { TestPoolConfig } from '../../test/pg-pool-config'
import { GetByCategoriesModel } from '../../../../../../data/protocols/db/categories/get-by-categories-repository'

describe('PgCategoriesRepository', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig)
    return
  })
  beforeEach(async () => {
    await PgHelper.query('DELETE FROM categories')
    return
  })
  afterEach(async () => {
    await PgHelper.query('DELETE FROM categories')
    return
  })
  afterAll(async () => {
    PgHelper.disconnect()
    return
  })
  describe('getAll', () => {
    it('Should call query with correct values', async () => {
      const sut = new PgCategoriesRepository()
      const querySpy = jest.spyOn(PgHelper, 'query')
      await sut.getAll()
      expect(querySpy).toHaveBeenCalledWith('SELECT * FROM categories')
    })
    it('Should throw if query throws', async () => {
      const sut = new PgCategoriesRepository()
      jest.spyOn(PgHelper, 'query').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.getAll()
      expect(promise).rejects.toThrow()
    })
    it('Should return categories on query succeed', async () => {
      PgHelper.query('INSERT INTO categories(name) VALUES($1)', [
        'any_category'
      ]).then(async () => {
        const sut = new PgCategoriesRepository()
        const result = await sut.getAll()
        expect(result[0].id).toBeTruthy()
        expect(result[0].name).toBe('any_category')
      })
    })
  })
  describe('GetBy', () => {
    const makeFakeRequest = (): GetByCategoriesModel => ({
      name: 'any_name'
    })
    it('Should call query with correct values', async () => {
      const sut = new PgCategoriesRepository()
      const querySpy = jest.spyOn(PgHelper, 'query')
      await sut.getBy(makeFakeRequest())
      expect(querySpy).toHaveBeenCalledWith(
        'SELECT * FROM categories WHERE LOWER(name) LIKE $1',
        ['%any_name%']
      )
    })
    it('Should throw if pg throws', async () => {
      const sut = new PgCategoriesRepository()
      jest.spyOn(PgHelper, 'query').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.getBy(makeFakeRequest())
      expect(promise).rejects.toThrow()
    })
    it('Should return categories on pg succeed', async () => {
      await PgHelper.query('INSERT INTO categories VALUES($1, $2)', [
        'any_id',
        'any_name'
      ])
      const sut = new PgCategoriesRepository()
      const result = await sut.getBy(makeFakeRequest())
      expect(result[0].id).toBeTruthy()
      expect(result[0].name).toBe('any_name')
    })
    it('Should return an empty array on pg fails', async () => {
      const sut = new PgCategoriesRepository()
      const result = await sut.getBy(makeFakeRequest())
      expect(result).toEqual([])
    })
  })
})
