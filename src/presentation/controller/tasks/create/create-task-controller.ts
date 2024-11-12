import { ICreateTask } from '@domain/usecases/tasks/create-task'
import { ILoadAccountById } from '@domain/usecases/users/load-account-by-id'
import { badRequest, created, serverError, unauthorized } from '@presentation/helpers/http-helper'
import { Controller } from '@presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@presentation/protocols/http'
import { IValidation } from '@presentation/protocols/validation'

export class CreateTaskController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly dbCreateTask: ICreateTask,
    private readonly loadAccountById: ILoadAccountById
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return new Promise((resolve) => resolve(badRequest(error)))
      }
      const user = await this.loadAccountById.loadById(httpRequest.body.userId)
      if (!user) {
        return new Promise(resolve => resolve(unauthorized()))
      }
      const createdTask = await this.dbCreateTask.create(httpRequest.body)
      return Promise.resolve(created(createdTask))
    } catch (error) {
      return new Promise(resolve => resolve(serverError()))
    }
  }
}
