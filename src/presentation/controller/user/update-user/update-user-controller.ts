import { IUpdateAccount } from '../../../../domain/usecases/users/update-account'
import {
  badRequest,
  Controller,
  forbidden,
  HttpRequest,
  HttpResponse,
  IValidation,
  ok,
  serverError
} from './update-user-protocols'

export class UpdateUserController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly updateUser: IUpdateAccount
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return new Promise((resolve) => resolve(badRequest(error)))
      }
  
      if (httpRequest.user !== httpRequest.body.id) {
        return new Promise((resolve) => resolve(forbidden()))
      }
  
      const updatedUser = await this.updateUser.update(httpRequest.body)
  
      return new Promise(resolve => resolve(ok(updatedUser)))
    } catch (error) {
      return new Promise(resolve => resolve(serverError()))
    }
  }
}
