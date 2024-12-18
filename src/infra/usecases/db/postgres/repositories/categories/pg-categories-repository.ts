import { IGetAllCategoriesRepository } from '../../../../../../data/protocols/db/categories/get-all-categories-repository'
import { ICategory } from '../../../../../../domain/protocols/category'
import { PgHelper } from '../../helpers/pg-helper'
import { GetByCategoriesModel, IGetByCategoriesRepository } from '../../../../../../data/protocols/db/categories/get-by-categories-repository'

export class PgCategoriesRepository
  implements IGetAllCategoriesRepository, IGetByCategoriesRepository
{
  async getAll(): Promise<ICategory[]> {
    const categories = await PgHelper.query('SELECT * FROM sch_todo_list.categories')
    return new Promise((resolve) => resolve(categories.rows))
  }

  async getBy(values: GetByCategoriesModel): Promise<ICategory[]> {
    const databaseValues = ['name']
    let queryLength = 1
    let queryString = 'SELECT * FROM sch_todo_list.categories WHERE '
    const queryValues: string[] = []
    for (const pos of databaseValues as ['name']) {
      if (values[pos]) {
        if (queryLength > 1) {
          queryString += 'AND '
        }
        queryString += `LOWER(${pos}) LIKE $${queryLength}`
        queryValues.push('%' + values[pos].toLowerCase() + '%')
        queryLength++
      }
    }
    console.log(queryValues)
    console.log(queryString)
    const categories = await PgHelper.query(queryString, queryValues)
    console.log(categories.rows)
    return Promise.resolve(categories.rows)
  }
}
