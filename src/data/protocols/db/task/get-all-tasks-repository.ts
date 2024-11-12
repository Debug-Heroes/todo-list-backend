import { ITask } from '@domain/protocols/task'

export interface IGetAllTasksRepository {
  getAll(id: string): Promise<ITask[]>
}
