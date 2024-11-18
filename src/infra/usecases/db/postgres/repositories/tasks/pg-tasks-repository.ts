import { IGetAllTasksRepository } from '@data/protocols/db/task/get-all-tasks-repository'
import { ITask } from '@domain/protocols/task'
import { PgHelper } from '../../helpers/pg-helper'
import { IGetTasksByCategoryRepository } from '@data/protocols/db/task/get-tasks-by-category-repository'
import { TaskByCategory } from '@domain/protocols/task-by-category'
import { GetTasksByCategoryModel } from '@domain/usecases/tasks/get-tasks-by-category'
import { ICategory } from '@domain/protocols/category'
import { ICreateTaskRepository } from '@data/protocols/db/task/create-task-repository'
import { ITaskModel } from '@domain/usecases/tasks/create-task'

export class PgTasksRepository
  implements
    IGetAllTasksRepository,
    IGetTasksByCategoryRepository,
    ICreateTaskRepository
{
  async getAll(id: string): Promise<ITask[]> {
    const result = await PgHelper.query(
      'SELECT * FROM sch_todo_list.tasks WHERE user_id = $1',
      [id]
    )
    return new Promise((resolve) => resolve(result.rows))
  }

  async getByCategory(
    model: GetTasksByCategoryModel
  ): Promise<TaskByCategory[]> {
    const result = await PgHelper.query(
      'SELECT sch_todo_list.tasks.id, sch_todo_list.tasks.name, sch_todo_list.tasks.text, sch_todo_list.task_by_category.user_id AS user_id, sch_todo_list.categories.name AS categoria, sch_todo_list.categories.id AS category_id FROM sch_todo_list.tasks INNER JOIN sch_todo_list.task_by_category ON sch_todo_list.tasks.id = sch_todo_list.task_by_category.task_id INNER JOIN sch_todo_list.categories ON sch_todo_list.task_by_category.category_id = sch_todo_list.categories.id WHERE sch_todo_list.task_by_category.user_id = $1 AND sch_todo_list.categories.id = $2',
      [model.user_id, model.category_id]
    )
    const foundTasks: TaskByCategory[] = []
    for (const task of result.rows) {
      const categorias: ICategory[] = []
      for (const pos of result.rows) {
        if (
          pos.categoryId === task.categoryId &&
          pos.user_id === model.user_id &&
          pos.id === task.id
        ) {
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
        categories: categorias,
        progress: task.progress,
        created_at: task.created_at
      })
    }
    return new Promise((resolve) => resolve(foundTasks))
  }

  async create(task: ITaskModel): Promise<ITask> {
    const createdTask = await PgHelper.query(
      'INSERT INTO sch_todo_list.tasks(name, text, user_id) VALUES($1, $2, $3) RETURNING *',
      [task.name, task.text || '', task.userId]
    )
    return new Promise((resolve) => resolve(createdTask.rows[0]))
  }
}
