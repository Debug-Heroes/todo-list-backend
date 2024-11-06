import { HttpRequest } from '@presentation/protocols/http'
import { IValidation } from '@presentation/protocols/validation'
import { GetTasksBycCategoryController } from './get-tasks-by-category-controller'
import { badRequest, serverError } from '@presentation/helpers/http-helper'
import {
  GetTasksByCategoryModel,
  IGetTasksByCategory
} from '@domain/usecases/tasks/get-tasks-by-category'
import { ICategory } from '@domain/protocols/category'
import { TaskByCategory } from '@domain/protocols/task-by-category'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    categoryId: 'any_id'
  }
})

interface SutTypes {
  sut: GetTasksBycCategoryController
  validationStub: IValidation
  dbGetTasksByCategoryStub: IGetTasksByCategory
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const dbGetTasksByCategoryStub = makeDbGetTasksByCategory()
  const sut = new GetTasksBycCategoryController(validationStub, dbGetTasksByCategoryStub)
  return {
    sut,
    validationStub,
    dbGetTasksByCategoryStub
  }
}

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
          ]
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
    jest.spyOn(dbGetTasksByCategoryStub, 'getByCategory').mockRejectedValueOnce(new Error())
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(serverError())
  })
})
