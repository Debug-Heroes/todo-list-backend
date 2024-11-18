import { HttpRequest } from '@presentation/protocols/http'
import { IValidation } from '@presentation/protocols/validation'
import { CreateTaskController } from './create-task-controller'
import {
  badRequest,
  created,
  serverError,
  unauthorized
} from '@presentation/helpers/http-helper'
import { ICreateTask, ITaskModel } from '@domain/usecases/tasks/create-task'
import { ITask, TASK_PROGRESS_TYPES } from '@domain/protocols/task'
import { ILoadAccountById } from '@domain/usecases/users/load-account-by-id'
import { IAccount } from '@domain/protocols/account'

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
  loadUserByIdStub: ILoadAccountById
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const dbCreateTaskStub = makeDbCreateTaskStub()
  const loadUserByIdStub = makeLoadUserByIdStub()
  const sut = new CreateTaskController(
    validationStub,
    dbCreateTaskStub,
    loadUserByIdStub
  )
  return {
    sut,
    validationStub,
    dbCreateTaskStub,
    loadUserByIdStub
  }
}

const fakeDate = new Date()

const makeDbCreateTaskStub = (): ICreateTask => {
  class DbCreateTaskStub implements ICreateTask {
    create(task: ITaskModel): Promise<ITask> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        text: 'any_text',
        userId: 'any_user',
        created_at: fakeDate,
        progress: TASK_PROGRESS_TYPES.NOT_STARTED
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

const makeLoadUserByIdStub = (): ILoadAccountById => {
  class LoadAccByIdStub implements ILoadAccountById {
    async loadById(id: string): Promise<IAccount | null> {
      return Promise.resolve({
        email: 'any_mail@mail.com',
        id: 'any_id',
        name: 'any_name',
        password: 'any_password'
      })
    }
  }
  return new LoadAccByIdStub()
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
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new Error('any_error'))
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
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(serverError())
  })
  it('Should call LoadUserById with correct values', async () => {
    const { sut, loadUserByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadUserByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith(makeFakeRequest().body.userId)
  })
  it('Should return 500 if LoadUserById throws', async () => {
    const { sut, loadUserByIdStub } = makeSut()
    jest.spyOn(loadUserByIdStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(serverError())
  })
  it('Should return 401 if user not found', async () => {
    const { sut, loadUserByIdStub } = makeSut()
    jest
      .spyOn(loadUserByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(unauthorized())
  })
  it('Should return 201 on DbCreateTask succeed', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(
      created({
        id: 'any_id',
        name: 'any_name',
        text: 'any_text',
        userId: 'any_user',
        progress: TASK_PROGRESS_TYPES.NOT_STARTED,
        created_at: fakeDate
      })
    )
  })
})
