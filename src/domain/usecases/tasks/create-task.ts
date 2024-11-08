import { ITask } from '@domain/protocols/task'

export interface ICreateTask {
  create(task: ITaskModel): Promise<ITask>
}

export interface ITaskModel {
  name: string
  text: string
  userId: string
}