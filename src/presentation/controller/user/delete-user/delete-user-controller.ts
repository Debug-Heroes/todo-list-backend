import { IValidation } from "../../../protocols/validation";
import { badRequest, Controller, HttpRequest, HttpResponse, ok } from "../../login/login-controller-protocols";

export class DeleteUserController implements Controller {
  constructor (
    private readonly validation: IValidation
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    // validar se tem id >> 400
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return new Promise(resolve => resolve(badRequest(error)))
    }
    // verificar se usuario existe >> 404 || 500
    // deletar usuario >> 200 || 500
    return new Promise(resolve => resolve(ok('')))
  }
}