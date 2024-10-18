/* eslint-disable @typescript-eslint/no-unused-vars */

import { IValidation } from '../../protocols/validation'
import {
  IAddAccount,
  IAddAccountModel
} from '../../../domain/usecases/users/add-account'
import { ILoadAccountByEmail } from '../../../domain/usecases/users/load-account'
import {
  HttpRequest,
  Controller,
  HttpResponse,
  badRequest,
  serverError,
  ok,
  EmailAlreadyExistError
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly addAccount: IAddAccount,
    private readonly loadAccountByEmail: ILoadAccountByEmail
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      // Dependencia de validação dos campos
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return new Promise((resolve) => resolve(badRequest(error)))
      }
      const { confirmPassword, ...addUser } = httpRequest.body
      // Dependencia que procura conta com o email recebido no banco de dados
      const foundAccount = await this.loadAccountByEmail.load(addUser.email)
      if (foundAccount) {
        return new Promise((resolve) =>
          resolve(badRequest(new EmailAlreadyExistError()))
        )
      }
      // Dependencia que adicione o usuario no banco de dados
      const account = await this.addAccount.add(addUser)
      return new Promise((resolve) => resolve(ok(account)))
    } catch (error) {
      return new Promise((resolve) => resolve(serverError()))
    }
  }
}
