import { DbCreateTask } from '@data/usecases/db/tasks/create/db-create-task'
import { PgTasksRepository } from '@infra/usecases/db/postgres/repositories/tasks/pg-tasks-repository'
import { CreateTaskController } from '@presentation/controller/tasks/create/create-task-controller'
import { makeCreateTasksValidation } from './create-tasks-validation'
import { PgAccountRepository } from '@infra/usecases/db/postgres/repositories/account/pg-account-repository'

export const makeCreateTasksController = (): CreateTaskController => {
  const repository = new PgTasksRepository()
  const dbCreateTask = new DbCreateTask(repository)
  const loadUserById = new PgAccountRepository()
  const createTaskController = new CreateTaskController(
    makeCreateTasksValidation(),
    dbCreateTask,
    loadUserById
  )
  return createTaskController
}
