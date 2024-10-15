import { IAddAccountRepository } from "../../../../../data/protocols/add-account-repository";
import { IAccount } from "../../../../../domain/protocols/account";
import { IAddAccountModel } from "../../../../../domain/usecases/users/add-account";
import { PgHelper } from "../helpers/pg-helper";

export class PgAccountRepository implements IAddAccountRepository {
  async add(account: IAddAccountModel): Promise<IAccount> {
    const newUser = await PgHelper.query('INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *', [account.name, account.email, account.password])
    console.log(newUser.rows)
    return newUser.rows[0]
  }
}