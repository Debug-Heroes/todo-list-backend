import { DbGetAllCategories } from '@data/usecases/db/categories/get/get-all-categories'
import { PgCategoriesRepository } from '@infra/usecases/db/postgres/repositories/categories/pg-categories-repository'
import { GetAllCategoriesController } from '@presentation/controller/categories/get/get-all-categories-controller'

export const makeGetAllCategoriesController =
  (): GetAllCategoriesController => {
    const repository = new PgCategoriesRepository()
    const dbGetAllCategories = new DbGetAllCategories(repository)
    const getAllCategories = new GetAllCategoriesController(dbGetAllCategories)
    return getAllCategories
  }
