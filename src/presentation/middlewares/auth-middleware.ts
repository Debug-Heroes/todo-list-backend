import { forbidden, ok, serverError } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { IDecrypter } from '../../domain/usecases/cryptography/decrypter'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class AuthMiddleware implements Controller {
  constructor(private readonly decrypter: IDecrypter) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.headers?.authorization) {
        return Promise.resolve(forbidden())
      }
      const token = httpRequest.headers.authorization.replace('Bearer ', '')
      const accountId = await this.decrypter.decrypt(token)
      console.log(accountId)
      if (!accountId) {
        return Promise.resolve(forbidden())
      }
      return Promise.resolve(ok({ id: accountId }))
    } catch (error: any) {
      return new Promise((resolve) => resolve(serverError()))
    }
  }
}
