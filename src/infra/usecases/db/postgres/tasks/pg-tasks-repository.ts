import { IGetAllTasksRepository } from "@data/protocols/db/task/get-all-tasks-repository";
import { ITask } from "@domain/protocols/task";
import { PgHelper } from "../helpers/pg-helper";
import { IGetTasksByCategoryRepository } from "@data/protocols/db/task/get-tasks-by-category-repository";
import { TaskByCategory } from "@domain/protocols/task-by-category";
import { GetTasksByCategoryModel } from "@domain/usecases/tasks/get-tasks-by-category";
import { ICategory } from "@domain/protocols/category";

export class PgTasksRepository implements IGetAllTasksRepository, IGetTasksByCategoryRepository {
  async getAll(id: string): Promise<ITask[]> {
    const result = await PgHelper.query('SELECT * FROM tasks WHERE user_id = $1', [id])
    return new Promise(resolve => resolve(result.rows))
  }

  async getByCategory(model: GetTasksByCategoryModel): Promise<TaskByCategory[]> {
    const result = await PgHelper.query('SELECT tasks.id, tasks.name, tasks.text, task_by_category.user_id AS user_id, categories.name AS categoria, categories.id AS category_id  FROM tasks INNER JOIN task_by_category ON tasks.id = task_by_category.task_id INNER JOIN categories ON task_by_category.category_id = categories.id WHERE task_by_category.user_id = $1 AND categories.id = $2', [model.user_id, model.category_id])
    const foundTasks: TaskByCategory[] = []
    for (const task of result.rows) {
      const categorias: ICategory[] = []
      for (const pos of result.rows) {
        if (pos.categoryId === task.categoryId && pos.user_id === model.user_id && pos.id === task.id) {
          categorias.push({
            id: pos.categoryId,
            name: pos.categoria
          })
        }
      }
      foundTasks.push({
        id: task.id,
        name: task.name,
        text: task.text,
        userId: result.rows[0].user_id,
        categories: categorias
      })
    }
    return new Promise(resolve => resolve(foundTasks))
  }
}