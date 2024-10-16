import { IAccount } from "../../../../domain/protocols/account";
import { IAuthentication, IAuthenticationModel } from "../../../../domain/usecases/users/authentication";
import { ILoadAccountByEmail } from "../../../../domain/usecases/users/load-account";

export class DbAuthentication implements IAuthentication {
  constructor(private readonly loadByEmail: ILoadAccountByEmail) {}
  async auth(account: IAuthenticationModel): Promise<IAccount | null> {
    const foundAccount = await this.loadByEmail.load(account.email)
    if (!foundAccount) {
      return Promise.resolve(null)
    }
    return Promise.resolve({} as IAccount)
  }
}