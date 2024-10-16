/* eslint-disable @typescript-eslint/no-unused-vars */
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

      const accountId = await this.decrypter.decrypt(
        httpRequest.headers.authorization
      )
      if (!accountId) {
        return Promise.resolve(forbidden())
      }
      return Promise.resolve(ok({ id: accountId }))
    } catch (error: any) {
      return new Promise((resolve) => resolve(serverError()))
    }
  }
}
