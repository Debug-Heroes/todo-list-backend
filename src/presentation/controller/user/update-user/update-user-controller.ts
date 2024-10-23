import { badRequest, Controller, HttpRequest, HttpResponse, IValidation } from "../login/login-controller-protocols";

export class UpdateUserController implements Controller {
  constructor(private readonly validation: IValidation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return new Promise(resolve => resolve(badRequest(error)))
    }
    return Promise.resolve({statusCode: 200})
  }
}