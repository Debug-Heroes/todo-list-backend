/* eslint-disable @typescript-eslint/no-unused-vars */
import { IEncrypter } from '../../../../data/protocols/criptography/encrypter'
import { IDecrypter } from '../../../../domain/usecases/cryptography/decrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly secret: string) {}
  async decrypt(encryptedValue: string): Promise<string | null> {
    try {
      const result = await jwt.verify(encryptedValue, this.secret)
      if (typeof result !== 'string') {
        return Promise.resolve(result.id)
      }
      throw new Error()
    } catch (error: any) {
      return Promise.resolve(null)
    }
  }
  async encrypt(anyValue: string): Promise<string> {
    return Promise.resolve('')
  }
}
