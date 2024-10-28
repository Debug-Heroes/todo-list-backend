import { ICategory } from '../../../../../domain/protocols/category'
import {
  IGetByCategories,
  IGetByCategoriesModel
} from '../../../../../domain/usecases/categories/get-by-categories'
import { IGetByCategoriesRepository } from '../../../../protocols/db/get-by-categories-repository'

export class DbGetByCategories implements IGetByCategories {
  constructor(private readonly repository: IGetByCategoriesRepository) {}
  async getBy(values: IGetByCategoriesModel): Promise<ICategory[]> {
    const result = await this.repository.getBy(values)
    return new Promise(resolve => resolve((result)))
  }
}
