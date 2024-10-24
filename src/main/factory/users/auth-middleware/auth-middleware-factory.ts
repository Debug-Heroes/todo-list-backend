import { JwtAdapter } from '../../../../infra/usecases/cryptography/jwt/jwt-adapter'
import { AuthMiddleware } from '../../../../presentation/middlewares/auth-middleware'
import env from '../../../config/env'

export const makeAuthMiddleware = (): AuthMiddleware => {
  const decrypter = new JwtAdapter(env.JWT_SECRET)
  const authMiddleware = new AuthMiddleware(decrypter)
  return authMiddleware
}
