import { IGetTasksByCategoryRepository } from '@data/protocols/db/task/get-tasks-by-category-repository'
import { TaskByCategory } from '@domain/protocols/task-by-category'
import { GetTasksByCategoryModel } from '@domain/usecases/tasks/get-tasks-by-category'
import { DbGetByTasks } from './db-get-by-tasks'
import { TASK_PROGRESS_TYPES } from '@domain/protocols/task'

const makeFakeRequest = (): GetTasksByCategoryModel => ({
  category_id: 'any_id',
  user_id: 'user_id'
})

interface SutTypes {
  sut: DbGetByTasks
  repository: IGetTasksByCategoryRepository
}

const makeSut = (): SutTypes => {
  const repository = makeGetTasksByCat()
  const sut = new DbGetByTasks(repository)
  return {
    sut,
    repository
  }
}

const fakeDate = new Date()

const makeGetTasksByCat = (): IGetTasksByCategoryRepository => {
  class GetTasksByCategoryRepository implements IGetTasksByCategoryRepository {
    async getByCategory(
      model: GetTasksByCategoryModel
    ): Promise<TaskByCategory[]> {
      return Promise.resolve([
        {
          id: 'any_id',
          name: 'any_name',
          text: 'any_text',
          userId: 'any_user',
          categories: [
            {
              id: 'any_id',
              name: 'any_name'
            }
          ],
          progress: TASK_PROGRESS_TYPES.NOT_STARTED,
          created_at: fakeDate
        }
      ])
    }
  }
  return new GetTasksByCategoryRepository()
}

describe('DbGetByTasks', () => {
  it('Should call repository with correct values', async () => {
    const { sut, repository } = makeSut()
    const getBySpy = jest.spyOn(repository, 'getByCategory')
    await sut.getByCategory(makeFakeRequest())
    expect(getBySpy).toHaveBeenCalledWith(makeFakeRequest())
  })
  it('Should throw if repository throws', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'getByCategory').mockImplementationOnce(() => {
      throw new Error('any_error')
    })
    const promise = sut.getByCategory(makeFakeRequest())
    expect(promise).rejects.toThrow(new Error('any_error'))
  })
  it('Should return tasks on repository succeed', async () => {
    const { sut } = makeSut()
    const result = await sut.getByCategory(makeFakeRequest())
    expect(result).toEqual([
      {
        id: 'any_id',
        name: 'any_name',
        text: 'any_text',
        userId: 'any_user',
        categories: [
          {
            id: 'any_id',
            name: 'any_name'
          }
        ],
        progress: TASK_PROGRESS_TYPES.NOT_STARTED,
        created_at: fakeDate
      }
    ])
  })
})
