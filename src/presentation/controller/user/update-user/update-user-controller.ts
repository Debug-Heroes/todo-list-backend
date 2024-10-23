import { Controller, HttpRequest, HttpResponse, IValidation } from "../login/login-controller-protocols";

export class UpdateUserController implements Controller {
  constructor(private readonly validation: IValidation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return Promise.resolve({statusCode: 200})
  }
}