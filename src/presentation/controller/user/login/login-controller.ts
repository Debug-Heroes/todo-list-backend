import { IAuthentication } from '../../../../domain/usecases/users/authentication'
import {
  badRequest,
  Controller,
  HttpRequest,
  HttpResponse,
  IValidation,
  ok,
  serverError,
  unauthorized
} from './login-controller-protocols'

export class LoginController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly authenticator: IAuthentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      // Dependencia de validação de campos
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return new Promise((resolve) => resolve(badRequest(error)))
      }
      // Dependencia de autenticação do usuário
      const token = await this.authenticator.auth(httpRequest.body)
      if (!token) {
        return new Promise((resolve) => resolve(unauthorized()))
      }
      return new Promise((resolve) => resolve(ok(token)))
    } catch (error: any) {
      return new Promise((resolve) => resolve(serverError()))
    }
  }
}
