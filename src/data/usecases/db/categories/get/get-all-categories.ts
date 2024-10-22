import { ICategory } from "../../../../../domain/protocols/category";
import { IGetAllCategories } from "../../../../../domain/usecases/categories/get-all-categories";
import { IGetAllCategoriesRepository } from "../../../../protocols/db/get-all-categories-repository";

export class DbGetAllCategories implements IGetAllCategories {
  constructor(private readonly getAllCategoriesRepository: IGetAllCategoriesRepository) {}
  async getAll(): Promise<ICategory[]> {
    await this.getAllCategoriesRepository.getAll()
    return Promise.resolve([])
  }
}