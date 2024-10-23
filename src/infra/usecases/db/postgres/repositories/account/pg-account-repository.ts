import { IAddAccountRepository } from '../../../../../../data/protocols/db/add-account-repository'
import { IDeleteAccountRepository } from '../../../../../../data/protocols/db/delete-account-repository'
import { IAccount } from '../../../../../../domain/protocols/account'
import { IAddAccountModel } from '../../../../../../domain/usecases/users/add-account'
import { ILoadAccountByEmail } from '../../../../../../domain/usecases/users/load-account'
import { ILoadAccountById } from '../../../../../../domain/usecases/users/load-account-by-id'
import { IUpdateAccountRepository } from '../../../../../../data/protocols/db/update-account-repository'
import { PgHelper } from '../../helpers/pg-helper'
import { UpdateAccountModel } from '../../../../../../domain/usecases/users/update-account'

export class PgAccountRepository
  implements IAddAccountRepository, ILoadAccountByEmail, IDeleteAccountRepository, ILoadAccountById, IUpdateAccountRepository
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

  async loadById(id: string): Promise<IAccount | null> {
    const result = await PgHelper.query('SELECT * FROM users WHERE id = $1', [id])
    return Promise.resolve(result.rows?.length > 0 ? result.rows[0] : null)
  }

  async update(account: UpdateAccountModel): Promise<IAccount> {
    const queryValues: string[] = []
    let queryString = 'UPDATE users SET'
    let queryIndex = 1
    if (account.email) {
      queryValues.push(account.email)
      queryString += ` email = $${queryIndex}`
      queryIndex++
    }
    if (account.name) {
      queryString += queryIndex > 1 ? ' ' : ''
      queryValues.push(account.name)
      queryString += ` name = $${queryIndex}`
      queryIndex++
    }

    queryValues.push(account.id)
    queryString += ` WHERE id = $${queryIndex} RETURNING *`

    const result = await PgHelper.query(queryString, queryValues)
    console.log(queryValues)
    console.log(queryString)
    console.log(result)
    return result.rows[0]
  }
}
