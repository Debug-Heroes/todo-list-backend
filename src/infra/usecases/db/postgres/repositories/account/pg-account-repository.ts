import { IAddAccountRepository } from '../../../../../../data/protocols/db/add-account-repository'
import { IDeleteAccountRepository } from '../../../../../../data/protocols/db/delete-account-repository'
import { IAccount } from '../../../../../../domain/protocols/account'
import { IAddAccountModel } from '../../../../../../domain/usecases/users/add-account'
import { ILoadAccountByEmail } from '../../../../../../domain/usecases/users/load-account'
import { PgHelper } from '../../helpers/pg-helper'

export class PgAccountRepository
  implements IAddAccountRepository, ILoadAccountByEmail, IDeleteAccountRepository
{
  async add(account: IAddAccountModel): Promise<IAccount> {
    const newUser = await PgHelper.query(
      'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *',
      [account.name, account.email, account.password]
    )
    return newUser.rows[0]
  }

  async load(email: string): Promise<IAccount | null> {
    const result = await PgHelper.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows?.length > 0 ? result.rows[0] : null
  }

  async delete(id: string): Promise<string> {
    const result = await PgHelper.query('DELETE FROM users WHERE id = $1', [id])
    return Promise.resolve(`${result.rowCount} affected rows`)
  }
}
