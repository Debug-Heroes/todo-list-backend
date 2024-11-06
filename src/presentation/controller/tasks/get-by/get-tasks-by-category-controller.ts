import { Controller } from "@presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@presentation/protocols/http";
import { IValidation } from "@presentation/protocols/validation";

export class GetTasksBycCategoryController implements Controller {
  constructor(private readonly validation: IValidation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.query)
    return Promise.resolve({statusCode: 200})
  }
}