/* eslint-disable @typescript-eslint/no-unused-vars */
 
import { IValidation } from '../../../domain/protocols/validation'
import { IAddAccount } from '../../../domain/usecases/users/add-account'
import {
  HttpRequest,
  Controller,
  HttpResponse,
  badRequest,
  serverError
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly addAccount: IAddAccount
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return new Promise(resolve => resolve(badRequest(error)))
      }
      const { confirmPassword, ...addUser } = httpRequest.body
      await this.addAccount.add(addUser)
      return new Promise((resolve) => resolve({ statusCode: 200 }))
    } catch (error) {
      return new Promise(resolve => resolve(serverError()))
    }
  }
}
