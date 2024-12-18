import { ICreateTaskRepository } from '@data/protocols/db/task/create-task-repository'
import { ITask } from '@domain/protocols/task'
import { ICreateTask, ITaskModel } from '@domain/usecases/tasks/create-task'

export class DbCreateTask implements ICreateTask {
  constructor(private readonly repository: ICreateTaskRepository) {}
  async create(task: ITaskModel): Promise<ITask> {
    const createdTask = await this.repository.create(task)
    return new Promise((resolve) => resolve(createdTask))
  }
}
