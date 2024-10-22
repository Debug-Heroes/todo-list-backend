import { PgCategoriesRepository } from './pg-categories-repository'
import { PgHelper } from "../../helpers/pg-helper"
import { TestPoolConfig } from '../../test/pg-pool-config'

describe('PgCategoriesRepository', () => {
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
  describe('getAll', () => {
    it('Should call query with correct values', async () => {
      const sut = new PgCategoriesRepository()
      const querySpy = jest.spyOn(PgHelper, 'query')
      await sut.getAll()
      expect(querySpy).toHaveBeenCalledWith('SELECT * FROM categories')
    })
  })
})