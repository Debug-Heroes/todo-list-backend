import { IGetTasksByCategoryRepository } from '@data/protocols/db/get-tasks-by-category-repository'
import { TaskByCategory } from '@domain/protocols/task-by-category'
import {
  GetTasksByCategoryModel,
  IGetTasksByCategory
} from '@domain/usecases/tasks/get-tasks-by-category'

export class DbGetByTasks implements IGetTasksByCategory {
  constructor(private readonly repository: IGetTasksByCategoryRepository) {}
  async getByCategory(
    model: GetTasksByCategoryModel
  ): Promise<TaskByCategory[]> {
    this.repository.getByCategory(model)
    return Promise.resolve([])
  }
}
