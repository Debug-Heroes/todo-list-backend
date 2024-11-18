import {
  HttpRequest,
  IValidation,
  badRequest,
  ok,
  serverError
} from './get-tasks-by-category-protocols'
import { GetTasksByCategoryController } from './get-tasks-by-category-controller'
import {
  GetTasksByCategoryModel,
  IGetTasksByCategory
} from '@domain/usecases/tasks/get-tasks-by-category'
import { TaskByCategory } from '@domain/protocols/task-by-category'
import { TASK_PROGRESS_TYPES } from '@domain/protocols/task'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    categoryId: 'any_id'
  }
})

interface SutTypes {
  sut: GetTasksByCategoryController
  validationStub: IValidation
  dbGetTasksByCategoryStub: IGetTasksByCategory
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const dbGetTasksByCategoryStub = makeDbGetTasksByCategory()
  const sut = new GetTasksByCategoryController(
    validationStub,
    dbGetTasksByCategoryStub
  )
  return {
    sut,
    validationStub,
    dbGetTasksByCategoryStub
  }
}

const fakeDate = new Date()

const makeDbGetTasksByCategory = (): IGetTasksByCategory => {
  class GetTasksByCategory implements IGetTasksByCategory {
    async getByCategory(
      model: GetTasksByCategoryModel
    ): Promise<TaskByCategory[]> {
      return Promise.resolve([
        {
          id: 'any_id',
          name: 'any_name',
          text: 'any_text',
          userId: 'any_user_id',
          categories: [
            {
              id: 'any_id',
              name: 'any_name'
            }
          ],
          created_at: fakeDate,
          progress: TASK_PROGRESS_TYPES.NOT_STARTED
        }
      ])
    }
  }
  return new GetTasksByCategory()
}

const makeValidationStub = () => {
  class ValidationStub implements IValidation {
    validate(data: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

describe('GetTasksByCategoryController', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().query)
  })
  it('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new Error('any_error'))
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(badRequest(new Error('any_error')))
  })
  it('Should call DbGetTasksByCategory with correct values', async () => {
    const { sut, dbGetTasksByCategoryStub } = makeSut()
    const getBySpy = jest.spyOn(dbGetTasksByCategoryStub, 'getByCategory')
    await sut.handle(makeFakeRequest())
    expect(getBySpy).toHaveBeenCalledWith(makeFakeRequest().query)
  })
  it('Should return 500 if DbGetTasksByCategory throws', async () => {
    const { sut, dbGetTasksByCategoryStub } = makeSut()
    jest
      .spyOn(dbGetTasksByCategoryStub, 'getByCategory')
      .mockRejectedValueOnce(new Error())
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(serverError())
  })
  it('Should return tasks with categories on DbGetTasksByCategory', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(
      ok([
        {
          id: 'any_id',
          name: 'any_name',
          text: 'any_text',
          userId: 'any_user_id',
          categories: [
            {
              id: 'any_id',
              name: 'any_name'
            }
          ],
          created_at: fakeDate,
          progress: TASK_PROGRESS_TYPES.NOT_STARTED
        }
      ])
    )
  })
})
