import middlewareAdapter from '@main/adapters/middleware-adapter'
import routeAdapter from '@main/adapters/route-adapter'
import { makeCreateTasksController } from '@main/factory/tasks/post/create-tasks-controller'
import { makeAuthMiddleware } from '@main/factory/users/auth-middleware/auth-middleware-factory'
import { Router } from 'express'

export default (router: Router) => {
  router.post(
    '/tasks',
    middlewareAdapter(makeAuthMiddleware()),
    routeAdapter(makeCreateTasksController())
  )
}
