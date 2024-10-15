/* eslint-disable @typescript-eslint/no-unused-vars */

import { IAccount } from '../../../domain/protocols/account'
import { IValidation } from '../../../domain/usecases/users/validation'
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
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return new Promise((resolve) => resolve(badRequest(error)))
      }
      const { confirmPassword, ...addUser } = httpRequest.body
      const existentAccount = await this.loadAccountByEmail.load(addUser.email)
      if (existentAccount) {
        return new Promise((resolve) =>
          resolve(badRequest(new EmailAlreadyExistError()))
        )
      }
      const account = await this.addAccount.add(addUser)
      return new Promise((resolve) => resolve(ok(account)))
    } catch (error) {
      return new Promise((resolve) => resolve(serverError()))
    }
  }
}
