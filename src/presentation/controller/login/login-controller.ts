import { IValidation } from "../../../domain/usecases/users/validation";
import { Controller, HttpRequest, HttpResponse } from "../signup/signup-controller-protocols";

export class LoginController implements Controller {
  constructor(private readonly validation: IValidation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body) 
    return Promise.resolve({statusCode: 200})
  }
}