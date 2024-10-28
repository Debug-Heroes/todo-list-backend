import { DbGetByCategories } from '../../../data/usecases/db/categories/get/get-by-categories'
import { PgCategoriesRepository } from '../../../infra/usecases/db/postgres/repositories/categories/pg-categories-repository'
import { GetByCategoriesController } from '../../../presentation/controller/categories/get/get-by-categories-controller'
import { makeGetByValidation } from './get-by-validation'

export const makeGetByCategoriesController =
  (): GetByCategoriesController => {
    const repository = new PgCategoriesRepository()
    const dbGetByCategories = new DbGetByCategories(repository)
    const getByCategories = new GetByCategoriesController(makeGetByValidation(), dbGetByCategories)
    return getByCategories
  }
