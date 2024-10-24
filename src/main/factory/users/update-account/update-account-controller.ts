import { DbUpdateAccount } from '../../../../data/usecases/db/users/update-account/update-account'
import { PgAccountRepository } from '../../../../infra/usecases/db/postgres/repositories/account/pg-account-repository'
import { UpdateUserController } from '../../../../presentation/controller/user/update-user/update-user-controller'
import { makeUpdateValidation } from './update-validation'

export const makeUpdateAccount = (): UpdateUserController => {
  const updateRepository = new PgAccountRepository()
  const updateUser = new DbUpdateAccount(updateRepository)
  const updateUserController = new UpdateUserController(makeUpdateValidation(), updateUser)
  return updateUserController
}
