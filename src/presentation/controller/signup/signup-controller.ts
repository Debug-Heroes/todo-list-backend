 
import { IValidation } from '../../../domain/protocols/validation'
import {
  HttpRequest,
  Controller,
  HttpResponse
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor(private readonly validation: IValidation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return new Promise((resolve) => resolve({ statusCode: 200 }))
  }
}
