import { IGetTasksByCategory } from '@domain/usecases/tasks/get-tasks-by-category'
import { badRequest, ok, serverError } from '@presentation/helpers/http-helper'
import { Controller } from '@presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@presentation/protocols/http'
import { IValidation } from '@presentation/protocols/validation'

export class GetTasksByCategoryController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly dbGetTasksByCategory: IGetTasksByCategory
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.query)
      if (error) {
        return new Promise((resolve) => resolve(badRequest(error)))
      }
      const tasks = await this.dbGetTasksByCategory.getByCategory(
        httpRequest.query
      )
      return new Promise((resolve) => resolve(ok(tasks)))
    } catch (error) {
      return new Promise((resolve) => resolve(serverError()))
    }
  }
}
