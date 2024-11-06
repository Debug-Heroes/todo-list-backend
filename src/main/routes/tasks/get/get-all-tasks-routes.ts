import middlewareAdapter from '@main/adapters/middleware-adapter'
import routeAdapter from '@main/adapters/route-adapter'
import { makeGetAllTasksController } from '@main/factory/tasks/get/get-all-tasks'
import { makeAuthMiddleware } from '@main/factory/users/auth-middleware/auth-middleware-factory'
import { Router } from 'express'

export default (router: Router) => {
  router.get(
    '/tasks',
    middlewareAdapter(makeAuthMiddleware()),
    routeAdapter(makeGetAllTasksController())
  )
}
