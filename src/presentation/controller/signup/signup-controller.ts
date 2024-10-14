 
import { IValidation } from '../../../domain/protocols/validation'
import {
  HttpRequest,
  Controller,
  HttpResponse,
  badRequest
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor(private readonly validation: IValidation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return new Promise(resolve => resolve(badRequest(error)))
    }
    return new Promise((resolve) => resolve({ statusCode: 200 }))
  }
}
