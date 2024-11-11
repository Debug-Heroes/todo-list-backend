import { DbCreateTask } from '@data/usecases/db/tasks/create/db-create-task'
import { PgTasksRepository } from '@infra/usecases/db/postgres/repositories/tasks/pg-tasks-repository'
import { CreateTaskController } from '@presentation/controller/tasks/create/create-task-controller'
import { makeCreateTasksValidation } from './create-tasks-validation'

export const makeCreateTasksController = (): CreateTaskController => {
  const repository = new PgTasksRepository()
  const dbCreateTask = new DbCreateTask(repository)
  const createTaskController = new CreateTaskController(
    makeCreateTasksValidation(),
    dbCreateTask
  )
  return createTaskController
}
