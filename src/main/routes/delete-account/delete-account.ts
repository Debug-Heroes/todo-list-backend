import { Router } from "express";
import routeAdapter from "../../adapters/route-adapter";
import { makeDeleteAccount } from "../../factory/users/delete-account-factory";

export default (router: Router) => {
  router.delete('/user', routeAdapter(makeDeleteAccount()))
}