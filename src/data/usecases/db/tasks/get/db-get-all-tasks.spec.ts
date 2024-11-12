import { IGetAllTasksRepository } from '@data/protocols/db/task/get-all-tasks-repository'
import { ITask } from '@domain/protocols/task'
import { DbGetAllTasks } from './db-get-all-tasks'

interface SutTypes {
  sut: DbGetAllTasks
  repository: IGetAllTasksRepository
}

const makeSut = (): SutTypes => {
  const repository = makeGetAllRepository()
  const sut = new DbGetAllTasks(repository)
  return {
    sut,
    repository
  }
}

const makeGetAllRepository = (): IGetAllTasksRepository => {
  class GetAllTasks implements IGetAllTasksRepository {
    async getAll(id: string): Promise<ITask[]> {
      return Promise.resolve([
        {
          id: 'any_id',
          name: 'any_name',
          text: 'any_text',
          userId: 'any_user'
        }
      ])
    }
  }
  return new GetAllTasks()
}

describe('DbGetAllTasks', () => {
  it('Should call repository with correct values', async () => {
    const { sut, repository } = makeSut()
    const getAllSpy = jest.spyOn(repository, 'getAll')
    await sut.getAll('any_id')
    expect(getAllSpy).toHaveBeenCalledWith('any_id')
  })
  it('Should throw if repository throws', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'getAll').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.getAll('any_id')
    expect(promise).rejects.toThrow()
  })
  it('Should return tasks on repository succeed', async () => {
    const { sut } = makeSut()
    const result = await sut.getAll('any_id')
    expect(result).toEqual([
      {
        id: 'any_id',
        name: 'any_name',
        text: 'any_text',
        userId: 'any_user'
      }
    ])
  })
})
