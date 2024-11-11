import { TaskByCategory } from '@domain/protocols/task-by-category'

export interface IGetTasksByCategory {
  getByCategory(model: GetTasksByCategoryModel): Promise<TaskByCategory[]>
}

export interface GetTasksByCategoryModel {
  user_id: string
  category_id: string
}
