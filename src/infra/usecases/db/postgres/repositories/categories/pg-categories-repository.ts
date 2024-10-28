import { IGetAllCategoriesRepository } from '../../../../../../data/protocols/db/get-all-categories-repository'
import { ICategory } from '../../../../../../domain/protocols/category'
import { PgHelper } from '../../helpers/pg-helper'
import { GetByCategoriesModel, IGetByCategoriesRepository } from '../../../../../../data/protocols/db/get-by-categories-repository'

export class PgCategoriesRepository
  implements IGetAllCategoriesRepository, IGetByCategoriesRepository
{
  async getAll(): Promise<ICategory[]> {
    const categories = await PgHelper.query('SELECT * FROM categories')
    return new Promise((resolve) => resolve(categories.rows))
  }

  async getBy(values: GetByCategoriesModel): Promise<ICategory[]> {
    const databaseValues = ['name']
    let queryLength = 1
    let queryString = 'SELECT * FROM categories WHERE '
    const queryValues: string[] = []
    for (const pos of databaseValues as ['name']) {
      if (values[pos]) {
        if (queryLength > 1) {
          queryString += 'AND '
        }
        queryString += `${pos} LIKE $${queryLength}`
        queryValues.push('%' + values[pos] + '%')
        queryLength++
      }
    }
    console.log(queryString)
    console.log(queryValues)
    await PgHelper.query(queryString, queryValues)
    return Promise.resolve([])
  }
}
