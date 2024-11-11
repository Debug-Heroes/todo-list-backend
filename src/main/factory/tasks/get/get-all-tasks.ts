import { DbGetAllTasks } from "@data/usecases/db/tasks/get/db-get-all-tasks";
import { PgTasksRepository } from "@infra/usecases/db/postgres/tasks/pg-tasks-repository";
import { GetAllTasksController } from "@presentation/controller/tasks/get/get-all-tasks-controller";

export const makeGetAllTasksController = (): GetAllTasksController => {
  const repository = new PgTasksRepository()
  const dbGetAllTasks =  new DbGetAllTasks(repository)
  const getAllTasksController = new GetAllTasksController(dbGetAllTasks)
  return getAllTasksController
}