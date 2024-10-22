import { ICategory } from '../../../../domain/protocols/category'
import { IGetAllCategories } from '../../../../domain/usecases/categories/get-all-categories'
import { serverError } from '../../../helpers/http-helper'
import { HttpRequest } from '../../../protocols/http'
import { GetAllCategoriesController } from './get-all-categories-controller'

interface SutTypes {
  sut: GetAllCategoriesController
  dbGetAllCategories: IGetAllCategories
}

const makeSut = (): SutTypes => {
  const dbGetAllCategories = makeDbGetAllCategories()
  const sut  = new GetAllCategoriesController(dbGetAllCategories)
  return {
    sut,
    dbGetAllCategories
  }
}

const makeDbGetAllCategories = (): IGetAllCategories => {
  class DbGetAllCategories implements IGetAllCategories {
    async getAll(): Promise<ICategory[]> {
      return Promise.resolve([
        {
          id: 'any_id',
          name: 'any_name'
        },
        {
          id: 'any_id',
          name: 'any_name'
        }
      ])
    }
  }
  return new DbGetAllCategories()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {}
})

describe('GetAllCategoriesController', () => {
  it('Should call DbGetAllCategories', async () => {
    const { sut, dbGetAllCategories } = makeSut()
    const getAllSpy = jest.spyOn(dbGetAllCategories, 'getAll')
    await sut.handle(makeFakeRequest())
    expect(getAllSpy).toHaveBeenCalledTimes(1)
  })
  it('Should return 500 if DbGetAllCategories throws', async () => {
    const { sut, dbGetAllCategories } = makeSut()
    jest.spyOn(dbGetAllCategories, 'getAll').mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(serverError())
  })
})