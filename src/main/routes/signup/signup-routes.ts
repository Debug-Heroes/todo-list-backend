import { Router } from "express"
import routeAdapter from "../../adapters/route-adapter"
import { makeSignUpController } from "../../factory/signup/signup-controller"

export default (router: Router) => {
  router.post('/sign', routeAdapter(makeSignUpController()) as any)
}