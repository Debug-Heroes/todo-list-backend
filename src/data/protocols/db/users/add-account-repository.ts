import { IAccount } from '../../../../domain/protocols/account'
import { IAddAccountModel } from '../../../../domain/usecases/users/add-account'

export interface IAddAccountRepository {
  add(account: IAddAccountModel): Promise<IAccount>
}
