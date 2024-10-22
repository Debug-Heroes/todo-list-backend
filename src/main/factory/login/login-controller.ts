import { DbAuthentication } from '../../../data/usecases/db/users/authenticate/db-authenticate'
import { BcryptAdapter } from '../../../infra/usecases/cryptography/bcrypt/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/usecases/cryptography/jwt/jwt-adapter'
import { PgAccountRepository } from '../../../infra/usecases/db/postgres/repositories/account/pg-account-repository'
import { LoginController } from '../../../presentation/controller/user/login/login-controller'
import env from '../../config/env'
import { makeLoginValidation } from './login-validation'

export const makeLoginController = (): LoginController => {
  const salt = 12
  const loadByEmail = new PgAccountRepository()
  const comparer = new BcryptAdapter(salt)
  const encrypter = new JwtAdapter(env.JWT_SECRET)
  const authenticator = new DbAuthentication(loadByEmail, comparer, encrypter)
  const loginController = new LoginController(
    makeLoginValidation(),
    authenticator
  )
  return loginController
}
