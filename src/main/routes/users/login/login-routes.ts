import { Router } from 'express'
import routeAdapter from '../../../adapters/route-adapter'
import { makeLoginController } from '../../../factory/users/login/login-controller'

export default (router: Router) => {
  router.post('/login', routeAdapter(makeLoginController()))
}
