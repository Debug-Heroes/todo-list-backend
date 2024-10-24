import { IDeleteAccount } from '../../../../domain/usecases/users/delete-account'
import { ILoadAccountById } from '../../../../domain/usecases/users/load-account-by-id'
import { IValidation } from '../../../protocols/validation'
import {
  badRequest,
  Controller,
  forbidden,
  HttpRequest,
  HttpResponse,
  NotFound,
  ok,
  serverError
} from './delete-user-protocols'

export class DeleteUserController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly loadAccountById: ILoadAccountById,
    private readonly deleteAccount: IDeleteAccount
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      // validar se tem id >> 400
      const error = this.validation.validate(httpRequest.query)
      if (error) {
        return new Promise((resolve) => resolve(badRequest(error)))
      }
      const { id } = httpRequest.query
      if (id !== httpRequest.user) {
        return new Promise((resolve) => resolve(forbidden()))
      }
      // Verificar se usuario existe 404 || 500
      const user = await this.loadAccountById.loadById(id)
      if (!user) {
        return new Promise((resolve) => resolve(NotFound()))
      }
      // deletar usuario >> 200 || 500
      const affectedRows = await this.deleteAccount.delete(id)
      return new Promise((resolve) => resolve(ok(affectedRows)))
    } catch (error) {
      console.log(error)
      return new Promise((resolve) => resolve(serverError()))
    }
  }
}
