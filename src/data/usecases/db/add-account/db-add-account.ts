 
import { IAccount } from "../../../../domain/protocols/account";
import { IAddAccount, IAddAccountModel } from "../../../../domain/usecases/users/add-account";
import { IAddAccountRepository } from "../../../protocols/add-account-repository";
import { IEncrypter } from "../../../protocols/encrypter";

export class DbAddAccount implements IAddAccount {
  constructor(
    private readonly hasher: IEncrypter,
    private readonly addAccountRepository: IAddAccountRepository
  ) {}
  async add(account: IAddAccountModel): Promise<IAccount> {
    const hashedPassword = await this.hasher.encrypt(account.password)
    const user = await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
    return Promise.resolve(user)
  }
}