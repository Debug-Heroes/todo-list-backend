import { Router } from 'express'
import routeAdapter from '../../adapters/route-adapter'
import { makeDeleteAccount } from '../../factory/users/delete-account-factory'
import middlewareAdapter from '../../adapters/middleware-adapter'
import { makeAuthMiddleware } from '../../factory/auth-middleware/auth-middleware-factory'

export default (router: Router) => {
  router.delete(
    '/user',
    middlewareAdapter(makeAuthMiddleware()),
    routeAdapter(makeDeleteAccount())
  )
}
