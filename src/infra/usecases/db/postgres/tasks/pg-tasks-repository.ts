import { IGetAllTasksRepository } from "@data/protocols/db/get-all-tasks-repository";
import { ITask } from "@domain/protocols/task";
import { PgHelper } from "../helpers/pg-helper";
import { IGetTasksByCategoryRepository } from "@data/protocols/db/get-tasks-by-category-repository";
import { TaskByCategory } from "@domain/protocols/task-by-category";
import { GetTasksByCategoryModel } from "@domain/usecases/tasks/get-tasks-by-category";

export class PgTasksRepository implements IGetAllTasksRepository, IGetTasksByCategoryRepository {
  async getAll(id: string): Promise<ITask[]> {
    const result = await PgHelper.query('SELECT * FROM tasks WHERE userid = $1', [id])
    return new Promise(resolve => resolve(result.rows))
  }

  async getByCategory(model: GetTasksByCategoryModel): Promise<TaskByCategory[]> {
    const result = await PgHelper.query('SELECT tasks.id, tasks.name, tasks.text, categories.name as categoria  FROM tasks INNER JOIN taskByCategory ON tasks.id = taskByCategory.taskId INNER JOIN categories ON taskByCategory.categoryId = categories.id WHERE taskByCategory.userId = $1 AND categories.id = $2', [model.id, model.categoryId])
    return new Promise(resolve => resolve(result.rows))
  }
}