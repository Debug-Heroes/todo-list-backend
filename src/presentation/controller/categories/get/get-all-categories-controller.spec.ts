import { ICategory } from '../../../../domain/protocols/category'
import { IGetAllCategories } from '../../../../domain/usecases/categories/get-all-categories'
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
})