import { HttpRequest } from "@presentation/protocols/http"
import { IValidation } from "@presentation/protocols/validation"
import { CreateTaskController } from "./create-task-controller"
import { badRequest, created } from "@presentation/helpers/http-helper"
import { ICreateTask, ITaskModel } from "@domain/usecases/tasks/create-task"
import { ITask } from "@domain/protocols/task"

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    text: 'any_text',
    userId: 'any_user'
  }
})

interface SutTypes {
  sut: CreateTaskController
  validationStub: IValidation
  dbCreateTaskStub: ICreateTask
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const dbCreateTaskStub = makeDbCreateTaskStub()
  const sut = new CreateTaskController(validationStub, dbCreateTaskStub)
  return {
    sut,
    validationStub,
    dbCreateTaskStub
  }
}

const makeDbCreateTaskStub = (): ICreateTask => {
  class DbCreateTaskStub implements ICreateTask {
    create(task: ITaskModel): Promise<ITask> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        text: 'any_text',
        userId: 'any_user'
      })
    }
  }
  return new DbCreateTaskStub()
}

const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(data: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

describe('CreateTaskController', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
  it('Should return badRequest on validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new Error('any_error')))
  })
  it('Should call DbCreateTask with correct values', async () => {
    const { sut, dbCreateTaskStub } = makeSut()
    const createSpy = jest.spyOn(dbCreateTaskStub, 'create')
    await sut.handle(makeFakeRequest())
    expect(createSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
  it('Should return 500 if DbCreateTask throw', async () => {
    const { sut, dbCreateTaskStub } = makeSut()
    jest.spyOn(dbCreateTaskStub, 'create').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.handle(makeFakeRequest())
    expect(promise).rejects.toThrow()
  })
  it('Should return 201 on DbCreateTask succeed', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(created({
      id: 'any_id',
      name: 'any_name',
      text: 'any_text',
      userId: 'any_user'
    }))
  })
})