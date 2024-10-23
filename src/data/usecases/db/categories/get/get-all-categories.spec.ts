import { ICategory } from '../../../../../domain/protocols/category'
import { IGetAllCategoriesRepository } from '../../../../protocols/db/get-all-categories-repository'
import { DbGetAllCategories } from './get-all-categories'

interface SutTypes {
  sut: DbGetAllCategories
  GetAllCategoriesRepository: IGetAllCategoriesRepository
}

const makeSut = (): SutTypes => {
  const GetAllCategoriesRepository = makeGetAllCategoriesRepository()
  const sut = new DbGetAllCategories(GetAllCategoriesRepository)
  return {
    sut,
    GetAllCategoriesRepository
  }
}

const makeGetAllCategoriesRepository = (): IGetAllCategoriesRepository => {
  class GetAllCategoryStub implements IGetAllCategoriesRepository {
    async getAll(): Promise<ICategory[]> {
      return Promise.resolve([
        {
          name: 'any_name',
          id: 'any_id'
        },
        {
          name: 'any_name',
          id: 'any_id'
        }
      ])
    }
  }
  return new GetAllCategoryStub()
}

describe('DbGetAllCategories', () => {
  it('Should call GetAllCategoriesRepository 1 time', async () => {
    const { sut, GetAllCategoriesRepository } = makeSut()
    const getAllSpy = jest.spyOn(GetAllCategoriesRepository, 'getAll')
    await sut.getAll()
    expect(getAllSpy).toHaveBeenCalledTimes(1)
  })
  it('Should throw if GetAllCategoriesRepository throws', async () => {
    const { sut, GetAllCategoriesRepository } = makeSut()
    jest
      .spyOn(GetAllCategoriesRepository, 'getAll')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const promise = sut.getAll()
    expect(promise).rejects.toThrow()
  })
  it('Should return categories on GetAllCategoriesRepository succeed', async () => {
    const { sut } = makeSut()
    const result = await sut.getAll()
    expect(result).toEqual([
      {
        name: 'any_name',
        id: 'any_id'
      },
      {
        name: 'any_name',
        id: 'any_id'
      }
    ])
  })
})
