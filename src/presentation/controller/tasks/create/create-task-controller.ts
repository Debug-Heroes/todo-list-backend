import { ICreateTask } from '@domain/usecases/tasks/create-task'
import { badRequest, created } from '@presentation/helpers/http-helper'
import { Controller } from '@presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@presentation/protocols/http'
import { IValidation } from '@presentation/protocols/validation'

export class CreateTaskController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly dbCreateTask: ICreateTask
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return new Promise((resolve) => resolve(badRequest(error)))
    }

    const createdTask = await this.dbCreateTask.create(httpRequest.body)
    return Promise.resolve(created(createdTask))
  }
}
