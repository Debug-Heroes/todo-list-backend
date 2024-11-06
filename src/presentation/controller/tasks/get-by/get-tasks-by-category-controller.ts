import { badRequest } from "@presentation/helpers/http-helper";
import { Controller } from "@presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@presentation/protocols/http";
import { IValidation } from "@presentation/protocols/validation";

export class GetTasksBycCategoryController implements Controller {
  constructor(private readonly validation: IValidation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.query)
    if (error) {
      return new Promise(resolve => resolve(badRequest(error)))
    }
    return Promise.resolve({statusCode: 200})
  }
}