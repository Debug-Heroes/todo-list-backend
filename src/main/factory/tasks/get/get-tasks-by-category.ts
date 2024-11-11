import { DbGetByTasks } from '@data/usecases/db/tasks/get/db-get-by-tasks'
import { PgTasksRepository } from '@infra/usecases/db/postgres/repositories/tasks/pg-tasks-repository'
import { GetTasksByCategoryController } from '@presentation/controller/tasks/get-by/get-tasks-by-category-controller'
import { makeGetTasksByCategoryValidation } from './get-tasks-by-category-validation'

export const makeGetTasksByCategoryController = (): GetTasksByCategoryController => {
  const repository = new PgTasksRepository()
  const DbGetTasksByCategory = new DbGetByTasks(repository)
  const getAllTasksController = new GetTasksByCategoryController(
    makeGetTasksByCategoryValidation(),
    DbGetTasksByCategory
  )
  return getAllTasksController
}
