import { Router } from 'express'
import routeAdapter from '../../../adapters/route-adapter'
import middlewareAdapter from '../../../adapters/middleware-adapter'
import { makeAuthMiddleware } from '../../../factory/users/auth-middleware/auth-middleware-factory'
import { makeGetAllCategoriesController } from '../../../factory/categories/get-all-categories-factory'

export default (router: Router) => {
  router.get(
    '/categories',
    middlewareAdapter(makeAuthMiddleware()),
    routeAdapter(makeGetAllCategoriesController())
  )
}
