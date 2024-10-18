import { ILoadAccountById } from "../../../../domain/usecases/users/load-account-by-id";
import { IValidation } from "../../../protocols/validation";
import { badRequest, Controller, HttpRequest, HttpResponse, NotFound, ok, serverError } from "../../login/login-controller-protocols";

export class DeleteUserController implements Controller {
  constructor (
    private readonly validation: IValidation,
    private readonly loadAccountById: ILoadAccountById
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      
      // validar se tem id >> 400
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return new Promise(resolve => resolve(badRequest(error)))
      }
      const { id } = httpRequest.body
      const user = await this.loadAccountById.load(id)
      if (!user) {
        return new Promise(resolve => resolve(NotFound()))
      }
  
      // Verificar se usuario existe 404 || 500
      // deletar usuario >> 200 || 500
      return new Promise(resolve => resolve(ok('')))
    } catch (error) {
      return new Promise(resolve => resolve(serverError()))
    }
  }
}