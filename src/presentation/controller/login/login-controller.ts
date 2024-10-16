import { IAuthentication } from "../../../domain/usecases/users/authentication";
import { IValidation } from "../../../domain/usecases/users/validation";
import { badRequest, Controller, HttpRequest, HttpResponse, unauthorized } from "../signup/signup-controller-protocols";

export class LoginController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly authenticator: IAuthentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return new Promise(resolve => resolve(badRequest(error)))
    }
    const user = await this.authenticator.auth(httpRequest.body)
    if (!user) {
      return new Promise(resolve => resolve(unauthorized()))
    }
    return new Promise(resolve => resolve({statusCode: 200}))
  }
}