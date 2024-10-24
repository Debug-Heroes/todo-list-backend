import { Router } from 'express'
import routeAdapter from '../../../adapters/route-adapter'
import middlewareAdapter from '../../../adapters/middleware-adapter'
import { makeAuthMiddleware } from '../../../factory/users/auth-middleware/auth-middleware-factory'
import { makeUpdateAccount } from '../../../factory/users/update-account/update-account-controller'

export default (router: Router) => {
  router.patch(
    '/user',
    middlewareAdapter(makeAuthMiddleware()),
    routeAdapter(makeUpdateAccount())
  )
}
