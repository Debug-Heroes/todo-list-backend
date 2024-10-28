import { ICategory } from '../../../../../domain/protocols/category'
import { GetByCategoriesModel, IGetByCategoriesRepository } from '../../../../protocols/db/get-by-categories-repository'
import { DbGetByCategories } from './get-by-categories'

const makeFakeRequest = (): GetByCategoriesModel => ({
  name: 'any_name'
})

interface SutTypes {
  sut: DbGetByCategories
  getByCategoriesRepoStub: IGetByCategoriesRepository
}

const makeSut = (): SutTypes => {
  const getByCategoriesRepoStub = makeGetByCategoriesRepoStub()
  const sut = new DbGetByCategories(getByCategoriesRepoStub)
  return {
    sut,
    getByCategoriesRepoStub
  }
}

const makeGetByCategoriesRepoStub = (): IGetByCategoriesRepository => {
  class GetByRepoStub implements IGetByCategoriesRepository {
    getBy(values: GetByCategoriesModel): Promise<ICategory[]> {
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
  return new GetByRepoStub()
}

describe('DbGetByCategories', () => {
  it('Should call repository with correct values', async () => {
    const { sut, getByCategoriesRepoStub } = makeSut()
    const getBySpy = jest.spyOn(getByCategoriesRepoStub, 'getBy')
    await sut.getBy(makeFakeRequest())
    expect(getBySpy).toHaveBeenCalledWith(makeFakeRequest())
  })
  it('Should throw if repository throws', async () => {
    const { sut, getByCategoriesRepoStub } = makeSut()
    jest.spyOn(getByCategoriesRepoStub, 'getBy').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.getBy(makeFakeRequest())
    expect(promise).rejects.toThrow()
  })
})