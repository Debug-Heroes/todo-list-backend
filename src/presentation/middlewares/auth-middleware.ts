import { forbidden } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
import { IDecrypter } from "../../domain/usecases/cryptography/decrypter";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class AuthMiddleware implements Controller {
  constructor(
    private readonly decrypter: IDecrypter
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.headers?.authorization) {
      return Promise.resolve(forbidden())
    }

    await this.decrypter.decrypt(httpRequest.headers.authorization)
    return Promise.resolve({statusCode: 200})
  }
}