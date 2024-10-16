import { DbAddAccount } from "../../../data/usecases/db/add-account/db-add-account";
import { BcryptAdapter } from "../../../infra/usecases/cryptography/bcrypt/bcrypt-adapter";
import { PgAccountRepository } from "../../../infra/usecases/db/postgres/account/pg-account-repository";
import { SignUpController } from "../../../presentation/controller/signup/signup-controller";
import { makeSignUpValidation } from "./signup-validation";

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const addAccount = new DbAddAccount(new BcryptAdapter(salt), new PgAccountRepository())
  const signUpController = new SignUpController(makeSignUpValidation(), addAccount, new PgAccountRepository())
  return signUpController
}