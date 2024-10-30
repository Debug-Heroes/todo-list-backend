import { IGetAllTasksRepository } from "@data/protocols/db/get-all-tasks-repository";
import { ITask } from "@domain/protocols/task";
import { IGetAllTasks } from "@domain/usecases/tasks/get-all-tasks";

export class DbGetAllTasks implements IGetAllTasks {
  constructor(private readonly repository: IGetAllTasksRepository) {}
  async getAll(id: string): Promise<ITask[]> {
    await this.repository.getAll(id)
    return Promise.resolve([])
  }
}