import { ICreateTaskRepository } from "@data/protocols/db/task/create-task-repository"
import { ITask } from "@domain/protocols/task"
import { ITaskModel } from "@domain/usecases/tasks/create-task"
import { DbCreateTask } from "./db-create-task"

interface SutTypes {
  sut: DbCreateTask
  repository: ICreateTaskRepository
}

const makeSut = (): SutTypes => {
  const repository = makeCreateTaskRepository()
  const sut = new DbCreateTask(repository)
  return {
    sut,
    repository
  }
}

const makeCreateTaskRepository = (): ICreateTaskRepository => {
  class CreateTRepositoryStub implements ICreateTaskRepository {
    async create(task: ITaskModel): Promise<ITask> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        text: 'any_text',
        userId: 'any_user'
      })
    }
  }
  return new CreateTRepositoryStub()
}

const makeFakeRequest  = (): ITaskModel => ({
  name: 'any_name',
  text: 'any_text',
  userId: 'any_user'
})

describe('DbCreateTask', () => {
  it('Should call repository with correct values', async () => {
    const { sut, repository } = makeSut()
    const createSpy = jest.spyOn(repository, 'create')
    await sut.create(makeFakeRequest())
    expect(createSpy).toHaveBeenCalledWith(makeFakeRequest())
  })
  it('Should throw if repository throws', async () => {
    const { sut, repository } = makeSut()
    jest.spyOn(repository, 'create').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.create(makeFakeRequest())
    expect(promise).rejects.toThrow()
  })
  it('Should return created task on succeed', async () => {
    const { sut } = makeSut()
    const result = await sut.create(makeFakeRequest())
    expect(result).toEqual({
      id: 'any_id',
      name: 'any_name',
      text: 'any_text',
      userId: 'any_user'
    })
  })
})