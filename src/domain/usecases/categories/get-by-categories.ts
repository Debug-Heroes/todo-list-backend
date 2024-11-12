import { ICategory } from '../../protocols/category'

export interface IGetByCategories {
  getBy(values: IGetByCategoriesModel): Promise<ICategory[]>
}

export interface IGetByCategoriesModel {
  name: string
}
