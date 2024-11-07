import { GetTasksByCategoryModel } from "@domain/usecases/tasks/get-tasks-by-category"
import { PgHelper } from "../helpers/pg-helper"
import { TestPoolConfig } from "../test/pg-pool-config"
import { PgTasksRepository } from "./pg-tasks-repository"

describe('PgTasksRepository', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig)
    return
  })
  beforeEach(async () => {
    await PgHelper.query('DELETE FROM taskByCategory')
    await PgHelper.query('DELETE FROM categories')
    await PgHelper.query('DELETE FROM tasks')
    await PgHelper.query('DELETE FROM users')
    return
  })
  afterEach(async () => {
    await PgHelper.query('DELETE FROM taskByCategory')
    await PgHelper.query('DELETE FROM categories')
    await PgHelper.query('DELETE FROM tasks')
    await PgHelper.query('DELETE FROM users')
    return
  })
  describe('GetAll', () => {
    it('Should call query with correct values', async () => {
      const sut = new PgTasksRepository()
      const querySpy = jest.spyOn(PgHelper, 'query')
      await sut.getAll('any_id')
      expect(querySpy).toHaveBeenCalledWith('SELECT * FROM tasks WHERE userid = $1', ['any_id'])
    })
    it('Should throw if query throws', async () => {
      const sut = new PgTasksRepository()
      jest.spyOn(PgHelper, 'query').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.getAll('any_id')
      expect(promise).rejects.toThrow()
    })
    it('Should return tasks on repository succeed', async () => {
      const user = await PgHelper.query('INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *', ['any_name', 'any_mail@mail.com', 'any_passord'])
      await PgHelper.query('INSERT INTO tasks(name, text, userid) VALUES($1, $2, $3)', ['any_name', 'any_text', user.rows[0].id])
      const sut = new PgTasksRepository()
      const result = await sut.getAll(user.rows[0].id)
      expect(result[0].id).toBeTruthy()
      expect(result[0].name).toBe('any_name')
      expect(result[0].text).toBe('any_text')
    })
  })
  describe('GetByCategory', () => {
    const makeFakeRequest = (): GetTasksByCategoryModel => ({
      categoryId: 'any_id',
      id: 'any_id'
    })
    it('Should call query with correct values', async () => {
      const sut = new PgTasksRepository()
      const querySpy = jest.spyOn(PgHelper, 'query')
      await sut.getByCategory(makeFakeRequest())
      expect(querySpy).toHaveBeenCalledWith('SELECT tasks.id, tasks.name, tasks.text, categories.name as categoria  FROM tasks INNER JOIN taskByCategory ON tasks.id = taskByCategory.taskId INNER JOIN categories ON taskByCategory.categoryId = categories.id WHERE taskByCategory.userId = $1 AND categories.id = $2', [makeFakeRequest().id, makeFakeRequest().categoryId])
    })
    it('Should throw if query throws', async () => {
      const sut = new PgTasksRepository()
      jest.spyOn(PgHelper, 'query').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.getByCategory(makeFakeRequest())
      expect(promise).rejects.toThrow()
    })
  })
})