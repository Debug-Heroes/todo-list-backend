import { ICategory } from "../../../../domain/protocols/category";

export interface IGetByCategoriesRepository {
  getBy(values: GetByCategoriesModel): Promise<ICategory[]>
}

export interface GetByCategoriesModel {
  name: string
}