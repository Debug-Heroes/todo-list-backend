import { ICategory } from "../../protocols/category";

export interface IGetAllCategories {
  getAll(): Promise<ICategory[]>
}