import { IGetAllCategoriesRepository } from "../../../../../../data/protocols/db/get-all-categories-repository";
import { ICategory } from "../../../../../../domain/protocols/category";
import { PgHelper } from "../../helpers/pg-helper";

export class PgCategoriesRepository implements IGetAllCategoriesRepository {
  async getAll(): Promise<ICategory[]> {
    const categories = await PgHelper.query('SELECT * FROM categories')
    return new Promise(resolve => resolve(categories.rows))
  }
}