import { IHasher } from '../../../../data/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IHasher {
  constructor(private readonly salt: number) {}
  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
