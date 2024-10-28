import { ITask } from "../../protocols/task";

export interface IGetAllTasks {
  getAll(id: string): Promise<ITask[]>
}