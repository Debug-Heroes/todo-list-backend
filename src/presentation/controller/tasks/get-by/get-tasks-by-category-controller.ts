import { IGetTasksByCategory } from "@domain/usecases/tasks/get-tasks-by-category";
import { badRequest } from "@presentation/helpers/http-helper";
import { Controller } from "@presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@presentation/protocols/http";
import { IValidation } from "@presentation/protocols/validation";

export class GetTasksBycCategoryController implements Controller {
  constructor(private readonly validation: IValidation, private readonly dbGetTasksByCategory: IGetTasksByCategory) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.query)
    if (error) {
      return new Promise(resolve => resolve(badRequest(error)))
    }
    await this.dbGetTasksByCategory.getByCategory(httpRequest.query)
    return Promise.resolve({statusCode: 200})
  }
}