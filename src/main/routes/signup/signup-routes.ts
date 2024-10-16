import { Router } from "express"
import routeAdapter from "../../adapters/route-adapter"
import { makeSignUpController } from "../../factory/signup/signup-controller"

export default (router: Router) => {
  router.post('/signup', routeAdapter(makeSignUpController()) as any)
}