import {
  IAuthentication,
  IAuthenticationModel
} from '../../../../../domain/usecases/users/authentication'
import { ILoadAccountByEmail } from '../../../../../domain/usecases/users/load-account'
import { IComparer } from '../../../../protocols/criptography/comparer'
import { IEncrypter } from '../../../../protocols/criptography/encrypter'

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadByEmail: ILoadAccountByEmail,
    private readonly comparer: IComparer,
    private readonly encrypter: IEncrypter
  ) {}
  async auth(account: IAuthenticationModel): Promise<string | null> {
    // Dependencia que encontra uma conta com o email recebido
    const foundAccount = await this.loadByEmail.load(account.email)
    if (!foundAccount) {
      return Promise.resolve(null)
    }
    // Dependencia que compara a senha criptografada do bd com a senha recebida
    const success = await this.comparer.compare(
      account.password,
      foundAccount.password
    )
    if (!success) {
      return Promise.resolve(null)
    }
    const token = await this.encrypter.encrypt(foundAccount.id)
    return Promise.resolve(token)
  }
}
