import { IGetAllTasksRepository } from "@data/protocols/db/get-all-tasks-repository";
import { ITask } from "@domain/protocols/task";
import { PgHelper } from "../helpers/pg-helper";

export class PgTasksRepository implements IGetAllTasksRepository {
  async getAll(id: string): Promise<ITask[]> {
    await PgHelper.query('SELECT * FROM tasks WHERE userid = $1', [id])
    return Promise.resolve([])
  }
}