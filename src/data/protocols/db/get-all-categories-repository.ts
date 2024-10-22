import { ICategory } from '../../../domain/protocols/category'

export interface IGetAllCategoriesRepository {
  getAll(): Promise<ICategory[]>
}
