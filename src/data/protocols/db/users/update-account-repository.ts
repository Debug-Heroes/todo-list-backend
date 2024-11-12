import { IAccount } from '../../../../domain/protocols/account'
import { UpdateAccountModel } from '../../../../domain/usecases/users/update-account'

export interface IUpdateAccountRepository {
  update(account: UpdateAccountModel): Promise<IAccount>
}
