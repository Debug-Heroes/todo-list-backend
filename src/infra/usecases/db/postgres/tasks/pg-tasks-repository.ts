import { IGetAllTasksRepository } from "@data/protocols/db/get-all-tasks-repository";
import { ITask } from "@domain/protocols/task";
import { PgHelper } from "../helpers/pg-helper";
import { IGetTasksByCategoryRepository } from "@data/protocols/db/get-tasks-by-category-repository";
import { TaskByCategory } from "@domain/protocols/task-by-category";
import { GetTasksByCategoryModel } from "@domain/usecases/tasks/get-tasks-by-category";
import { ICategory } from "@domain/protocols/category";

export class PgTasksRepository implements IGetAllTasksRepository, IGetTasksByCategoryRepository {
  async getAll(id: string): Promise<ITask[]> {
    const result = await PgHelper.query('SELECT * FROM tasks WHERE userid = $1', [id])
    return new Promise(resolve => resolve(result.rows))
  }

  async getByCategory(model: GetTasksByCategoryModel): Promise<TaskByCategory[]> {
    const result = await PgHelper.query('SELECT tasks.id, tasks.name, tasks.text, taskByCategory.userId AS userId, categories.name AS categoria  FROM tasks INNER JOIN taskByCategory ON tasks.id = taskByCategory.taskId INNER JOIN categories ON taskByCategory.categoryId = categories.id WHERE taskByCategory.userId = $1 AND categories.id = $2', [model.id, model.categoryId])
    const foundTasks: TaskByCategory[] = []
    for (const task of result.rows) {
      const categorias: ICategory[] = result.rows.filter(fTask => {
        return fTask.categoryId === task.categoryId
      })
      foundTasks.push({
        id: task.id,
        name: task.name,
        text: task.text,
        userId: result.rows[0].userid,
        categories: categorias
      })
    }
    return new Promise(resolve => resolve(foundTasks))
  }
}