import middlewareAdapter from '@main/adapters/middleware-adapter'
import routeAdapter from '@main/adapters/route-adapter'
import { makeGetTasksByCategoryController } from '@main/factory/tasks/get/get-tasks-by-category'
import { makeAuthMiddleware } from '@main/factory/users/auth-middleware/auth-middleware-factory'
import { Router } from 'express'

export default (router: Router) => {
  router.get(
    '/tasks_by_category',
    middlewareAdapter(makeAuthMiddleware()),
    routeAdapter(makeGetTasksByCategoryController())
  )
}
