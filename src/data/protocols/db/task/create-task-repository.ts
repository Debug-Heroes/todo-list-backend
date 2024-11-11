import { ITask } from "@domain/protocols/task";
import { ITaskModel } from "@domain/usecases/tasks/create-task";

export interface ICreateTaskRepository {
  create(task: ITaskModel): Promise<ITask>
}