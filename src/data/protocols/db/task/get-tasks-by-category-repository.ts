import { TaskByCategory } from '@domain/protocols/task-by-category'
import { GetTasksByCategoryModel } from '@domain/usecases/tasks/get-tasks-by-category'

export interface IGetTasksByCategoryRepository {
  getByCategory(model: GetTasksByCategoryModel): Promise<TaskByCategory[]>
}
