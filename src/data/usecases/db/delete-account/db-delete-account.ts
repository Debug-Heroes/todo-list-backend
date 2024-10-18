import { IDeleteAccount } from "../../../../domain/usecases/users/delete-account";
import { IDeleteAccountRepository } from "../../../protocols/db/delete-account-repository";

export class DbDeleteAccount implements IDeleteAccount {
  constructor (private readonly deleteAccountRepository: IDeleteAccountRepository) {}
  async delete(id: string): Promise<string> {
    await this.deleteAccountRepository.delete(id)
    return Promise.resolve('')
  }
}