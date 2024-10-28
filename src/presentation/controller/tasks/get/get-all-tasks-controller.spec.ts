import { HttpRequest } from '@presentation/protocols/http'
import { GetAllTasksController } from './get-all-tasks-controller'
import { IGetAllTasks } from '@domain/usecases/tasks/get-all-tasks'
import { ITask } from '@domain/protocols/task'
import { serverError } from './get-all-tasks-protocols'

interface SutTypes {
  sut: GetAllTasksController
  dbGetAllTasks: IGetAllTasks
}

const makeSut = (): SutTypes => {
  const dbGetAllTasks = makeDbGetAllTasksStub()
  const sut = new GetAllTasksController(dbGetAllTasks)
  return {
    sut,
    dbGetAllTasks
  }
}

const makeDbGetAllTasksStub = (): IGetAllTasks => {
  class DbGetAllTasksStub implements IGetAllTasks {
    async getAll(id: string): Promise<ITask[]> {
      return Promise.resolve([
        {
          id: 'any_id',
          name: 'any_name',
          text: 'any_text',
          userId: 'any_userId'
        },
        {
          id: 'any_id2',
          name: 'any_name2',
          text: 'any_text2',
          userId: 'any_userId2'
        }
      ])
    }
  }
  return new DbGetAllTasksStub()
}

const makeFakeRequest = (): HttpRequest => ({
  user: 'any_id'
})

describe('GetAllTasksController', () => {
  it('Should call DbGetAllTasks with correct values', async () => {
    const { sut, dbGetAllTasks } = makeSut()
    const getAllSpy = jest.spyOn(dbGetAllTasks, 'getAll')
    await sut.handle(makeFakeRequest())
    expect(getAllSpy).toHaveBeenCalledWith(makeFakeRequest().user)
  })
  it('Should return 500 if DbGetAllTasks throws', async () => {
    const { sut, dbGetAllTasks } = makeSut()
    jest.spyOn(dbGetAllTasks, 'getAll').mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(serverError())
  })
})
