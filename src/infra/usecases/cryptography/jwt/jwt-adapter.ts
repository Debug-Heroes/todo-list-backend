/* eslint-disable @typescript-eslint/no-unused-vars */
import { IEncrypter } from "../../../../data/protocols/encrypter";
import { IDecrypter } from "../../../../domain/usecases/cryptography/decrypter";
import jwt from 'jsonwebtoken'

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(
    private readonly secret: string
  ) {}
  async decrypt(encryptedValue: string): Promise<string | null> {
    await jwt.verify(encryptedValue, this.secret)
    return Promise.resolve(null)
  }
  async encrypt(anyValue: string): Promise<string> {
    return Promise.resolve('')
  }
}