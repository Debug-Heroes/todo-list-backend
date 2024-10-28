import { IGetAllTasks } from '@domain/usecases/tasks/get-all-tasks'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { ok, serverError } from './get-all-tasks-protocols'

export class GetAllTasksController implements Controller {
  constructor(private readonly dbGetAllTasks: IGetAllTasks) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.dbGetAllTasks.getAll(httpRequest.user)
      return Promise.resolve(ok(result))
    } catch (error) {
      return new Promise(resolve => resolve(serverError()))
    }
  }
}
