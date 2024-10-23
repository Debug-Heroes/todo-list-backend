import {
  badRequest,
  Controller,
  forbidden,
  HttpRequest,
  HttpResponse,
  IValidation
} from './update-user-protocols'

export class UpdateUserController implements Controller {
  constructor(private readonly validation: IValidation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return new Promise((resolve) => resolve(badRequest(error)))
    }

    if (httpRequest.user !== httpRequest.body.id) {
      return new Promise((resolve) => resolve(forbidden()))
    }

    return Promise.resolve({ statusCode: 200 })
  }
}
