import { Router } from 'express'
import routeAdapter from '../../../adapters/route-adapter'
import { makeGetByCategoriesController } from '../../../factory/categories/get-by-categories-factory'

export default (router: Router) => {
  router.get(
    '/categories/query',
    routeAdapter(makeGetByCategoriesController())
  )
}
