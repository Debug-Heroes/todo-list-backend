import { IAccount } from '../../../../../domain/protocols/account'
import {
  IAddAccount,
  IAddAccountModel
} from '../../../../../domain/usecases/users/add-account'
import { IAddAccountRepository } from '../../../../protocols/db/users/add-account-repository'
import { IHasher } from '../../../../protocols/criptography/hasher'

export class DbAddAccount implements IAddAccount {
  constructor(
    private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository
  ) {}
  async add(account: IAddAccountModel): Promise<IAccount> {
    // Dependencia de criptografia
    const hashedPassword = await this.hasher.hash(account.password)
    // Repositório que insira o usuário no banco de dados
    const user = await this.addAccountRepository.add(
      Object.assign({}, account, { password: hashedPassword })
    )
    return Promise.resolve(user)
  }
}
