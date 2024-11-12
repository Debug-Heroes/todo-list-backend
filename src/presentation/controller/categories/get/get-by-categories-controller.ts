import { IGetByCategories } from '../../../../domain/usecases/categories/get-by-categories'
import { badRequest, ok, serverError } from '../../../helpers/http-helper'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'
import { IValidation } from '../../../protocols/validation'

export class GetByCategoriesController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly dbGetByCategory: IGetByCategories
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.query)
      if (error) {
        return new Promise((resolve) => resolve(badRequest(error)))
      }
      const categories = await this.dbGetByCategory.getBy(httpRequest.query)
      return Promise.resolve(ok(categories))
    } catch (error) {
      return new Promise((resolve) => resolve(serverError()))
    }
  }
}
