import { HttpRequest } from '../../../protocols/http'
import { IValidation } from '../../../protocols/validation'
import { GetByCategoriesController } from './get-by-categories-controller'
import { badRequest } from '../../../helpers/http-helper'
import { IGetByCategories, IGetByCategoriesModel } from '../../../../domain/usecases/categories/get-by-categories'
import { ICategory } from '../../../../domain/protocols/category'

const makeFakeRequest = (): HttpRequest => ({
  query: {
    name: 'any_name'
  }
})

interface SutTypes {
  sut: GetByCategoriesController
  validationStub: IValidation
  dbGetByCategories: IGetByCategories
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const dbGetByCategories = makeGetByCategories()
  const sut = new GetByCategoriesController(validationStub, dbGetByCategories)
  return {
    sut,
    validationStub,
    dbGetByCategories
  }
}

const makeGetByCategories = (): IGetByCategories => {
  class DbGetByCategories implements IGetByCategories {
    async getBy(values: IGetByCategoriesModel): Promise<ICategory[]> {
      return Promise.resolve([
        {
          id: 'any_id',
          name: 'any_name'
        },
        {
          id: 'any_id2',
          name: 'any_name2'
        }
      ])
    }
  }
  return new DbGetByCategories()
}

const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(data: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

describe('GetByCategoriesController', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().query)
  })
  it('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(badRequest(new Error('any_error')))
  })
  it('Should call DbGetByCategories with correct values', async () => {
    const { sut, dbGetByCategories } = makeSut()
    const getBySpy = jest.spyOn(dbGetByCategories, 'getBy')
    await sut.handle(makeFakeRequest())
    expect(getBySpy).toHaveBeenCalledWith(makeFakeRequest().query)
  })
})