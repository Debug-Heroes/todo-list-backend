import { IGetAllTasks } from '@domain/usecases/tasks/get-all-tasks'
import { badRequest } from '../../../helpers/http-helper'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { IValidation } from '../../../protocols/validation'

export class GetAllTasksController implements Controller {
  constructor(private readonly dbGetAllTasks: IGetAllTasks) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.dbGetAllTasks.getAll(httpRequest.user)
    return Promise.resolve({ statusCode: 200 })
  }
}
