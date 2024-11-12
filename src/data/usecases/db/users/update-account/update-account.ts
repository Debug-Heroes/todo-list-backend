import {
  IUpdateAccount,
  IUpdatedAccount,
  UpdateAccountModel
} from '../../../../../domain/usecases/users/update-account'
import { IUpdateAccountRepository } from '../../../../protocols/db/users/update-account-repository'

export class DbUpdateAccount implements IUpdateAccount {
  constructor(private readonly repository: IUpdateAccountRepository) {}
  async update(values: UpdateAccountModel): Promise<IUpdatedAccount> {
    const account = await this.repository.update(values)
    const { password, ...updatedAccount } = account
    return new Promise((resolve) => resolve(updatedAccount))
  }
}
