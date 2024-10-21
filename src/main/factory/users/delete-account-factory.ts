import { PgAccountRepository } from "../../../infra/usecases/db/postgres/account/pg-account-repository";
import { DeleteUserController } from "../../../presentation/controller/user/delete-user/delete-user-controller";
import { makeDeleteValidation } from "./delete-validation";

export const makeDeleteAccount = (): DeleteUserController => {
  const deleteUserController = new DeleteUserController(makeDeleteValidation(), new PgAccountRepository(), new PgAccountRepository())
  return deleteUserController
}