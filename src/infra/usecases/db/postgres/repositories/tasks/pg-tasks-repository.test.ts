import { GetTasksByCategoryModel } from '@domain/usecases/tasks/get-tasks-by-category'
import { PgHelper } from '../../helpers/pg-helper'
import { TestPoolConfig } from '../../test/pg-pool-config'
import { PgTasksRepository } from './pg-tasks-repository'
import { ITaskModel } from '@domain/usecases/tasks/create-task'

describe('PgTasksRepository', () => {
  beforeAll(async () => {
    PgHelper.connect(TestPoolConfig)
    return
  })
  beforeEach(async () => {
    await PgHelper.query('DELETE FROM task_by_category')
    await PgHelper.query('DELETE FROM categories')
    await PgHelper.query('DELETE FROM tasks')
    await PgHelper.query('DELETE FROM users')
    return
  })
  afterEach(async () => {
    await PgHelper.query('DELETE FROM task_by_category')
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
      expect(querySpy).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE user_id = $1',
        ['any_id']
      )
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
      const user = await PgHelper.query(
        'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *',
        ['any_name', 'any_mail@mail.com', 'any_passord']
      )
      await PgHelper.query(
        'INSERT INTO tasks(name, text, user_id) VALUES($1, $2, $3)',
        ['any_name', 'any_text', user.rows[0].id]
      )
      const sut = new PgTasksRepository()
      const result = await sut.getAll(user.rows[0].id)
      expect(result[0].id).toBeTruthy()
      expect(result[0].name).toBe('any_name')
      expect(result[0].text).toBe('any_text')
    })
  })
  describe('GetByCategory', () => {
    const makeFakeRequest = (): GetTasksByCategoryModel => ({
      category_id: 'any_id',
      user_id: 'any_id'
    })
    it('Should call query with correct values', async () => {
      const sut = new PgTasksRepository()
      const querySpy = jest.spyOn(PgHelper, 'query')
      await sut.getByCategory(makeFakeRequest())
      expect(querySpy).toHaveBeenCalledWith(
        'SELECT tasks.id, tasks.name, tasks.text, task_by_category.user_id AS user_id, categories.name AS categoria, categories.id AS category_id  FROM tasks INNER JOIN task_by_category ON tasks.id = task_by_category.task_id INNER JOIN categories ON task_by_category.category_id = categories.id WHERE task_by_category.user_id = $1 AND categories.id = $2',
        [makeFakeRequest().user_id, makeFakeRequest().category_id]
      )
    })
    it('Should throw if query throws', async () => {
      const sut = new PgTasksRepository()
      jest.spyOn(PgHelper, 'query').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.getByCategory(makeFakeRequest())
      expect(promise).rejects.toThrow()
    })
    it('Should return tasks with category on succeed', async () => {
      const user = await PgHelper.query(
        'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *',
        ['any_name', 'any_mail@mail.com', 'any_passord']
      )
      const task = await PgHelper.query(
        'INSERT INTO tasks(name, text, user_id) VALUES($1, $2, $3) RETURNING *',
        ['any_name', 'any_text', user.rows[0].id]
      )
      const category = await PgHelper.query(
        'INSERT INTO categories(name) VALUES($1) RETURNING *',
        ['any_category']
      )
      await PgHelper.query(
        'INSERT INTO task_by_category(user_id, task_id, category_id) VALUES($1, $2, $3)',
        [user.rows[0].id, task.rows[0].id, category.rows[0].id]
      )
      const sut = new PgTasksRepository()
      const result = await sut.getByCategory({
        category_id: category.rows[0].id,
        user_id: user.rows[0].id
      })
      console.log(result)
      expect(result[0].id).toBeTruthy()
      expect(result[0].name).toBe('any_name')
      expect(result[0].text).toBe('any_text')
      expect(result[0].userId).toBe(user.rows[0].id)
      expect(result[0].categories[0].name).toBe('any_category')
    })
  })
  describe('CreateTask', () => {
    const makeFakeRequest = (): ITaskModel => ({
      name: 'any_name',
      text: 'any_text',
      userId: 'any_user'
    })
    it('Should call query with correct values', async () => {
      await PgHelper.query(
        'INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4) RETURNING *',
        ['any_user', 'any_name', 'any_mail@mail.com', 'any_passord']
      )
      const sut = new PgTasksRepository()
      const querySpy = jest.spyOn(PgHelper, 'query')
      await sut.create(makeFakeRequest())
      const { ...user } = makeFakeRequest()
      expect(querySpy).toHaveBeenCalledWith('INSERT INTO tasks(name, text, user_id) VALUES($1, $2, $3) RETURNING *', [user.name, user.text, user.userId])
    })
    it('Should throw if query throws', async () => {
      const sut = new PgTasksRepository()
      jest.spyOn(PgHelper, 'query').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.create(makeFakeRequest())
      expect(promise).rejects.toThrow()
    })
    it('Should return created task on succeed', async () => {
      await PgHelper.query('INSERT INTO users VALUES($1, $2, $3, $4)', ['any_user', 'any_name', 'any_mail@mail.com', '123123123'])
      const sut = new PgTasksRepository()
      const result = await sut.create(makeFakeRequest())
      expect(result.id).toBeTruthy()
      expect(result.name).toBe('any_name')
    })
  })
})
