import { IGetAllCategoriesRepository } from "../../../../../../data/protocols/db/get-all-categories-repository";
import { ICategory } from "../../../../../../domain/protocols/category";
import { PgHelper } from "../../helpers/pg-helper";

export class PgCategoriesRepository implements IGetAllCategoriesRepository {
  async getAll(): Promise<ICategory[]> {
    await PgHelper.query('SELECT * FROM categories')
    return Promise.resolve([])
  }
}