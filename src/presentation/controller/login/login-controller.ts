/* eslint-disable @typescript-eslint/no-unused-vars */
import { IEncrypter } from '../../../data/protocols/encrypter'
import { IAuthentication } from '../../../domain/usecases/users/authentication'
import { IValidation } from '../../../domain/usecases/users/validation'
import {
  badRequest,
  Controller,
  HttpRequest,
  HttpResponse,
  ok,
  serverError,
  unauthorized
} from '../login/login-controller-protocols'

export class LoginController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly authenticator: IAuthentication,
    private readonly encrypter: IEncrypter
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      // Dependencia de validação de campos
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return new Promise((resolve) => resolve(badRequest(error)))
      }
      // Dependencia de autenticação do usuário
      const user = await this.authenticator.auth(httpRequest.body)
      if (!user) {
        return new Promise((resolve) => resolve(unauthorized()))
      }
      // Dependencia de geração de token de acesso
      const token = await this.encrypter.encrypt(user.id)
      return new Promise((resolve) => resolve(ok(token)))
    } catch (error: any) {
      return new Promise((resolve) => resolve(serverError()))
    }
  }
}
