import { IUpdateAccount, IUpdatedAccount, UpdateAccountModel } from "../../../../../domain/usecases/users/update-account";
import { IUpdateAccountRepository } from "../../../../protocols/db/update-account-repository";

export class DbUpdateAccount implements IUpdateAccount {
  constructor(private readonly repository: IUpdateAccountRepository) {}
  async update(values: UpdateAccountModel): Promise<IUpdatedAccount> {
    await this.repository.update(values)
    return Promise.resolve({
      id: 'any_id',
      email: 'any_mail',
      name: 'any_name',
      password: 'any_password'
    })
  }
}