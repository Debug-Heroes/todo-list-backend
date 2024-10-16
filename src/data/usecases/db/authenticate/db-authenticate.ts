import { IAccount } from "../../../../domain/protocols/account";
import { IAuthentication, IAuthenticationModel } from "../../../../domain/usecases/users/authentication";
import { ILoadAccountByEmail } from "../../../../domain/usecases/users/load-account";
import { IComparer } from "../../../protocols/criptography/comparer";

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadByEmail: ILoadAccountByEmail,
    private readonly comparer: IComparer
  ) {}
  async auth(account: IAuthenticationModel): Promise<IAccount | null> {
    const foundAccount = await this.loadByEmail.load(account.email)
    if (!foundAccount) {
      return Promise.resolve(null)
    }
    const success = await this.comparer.compare(account.password, foundAccount.password)
    if (!success) {
      return Promise.resolve(null)
    }
    return Promise.resolve(foundAccount)
  }
}