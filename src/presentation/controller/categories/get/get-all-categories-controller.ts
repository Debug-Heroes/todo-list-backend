import { IGetAllCategories } from '../../../../domain/usecases/categories/get-all-categories'
import { ok, serverError } from '../../../helpers/http-helper'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'

export class GetAllCategoriesController implements Controller {
  constructor(private readonly getAllCategories: IGetAllCategories) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const categories = await this.getAllCategories.getAll()
      return new Promise((resolve) => resolve(ok(categories)))
    } catch (error) {
      return new Promise(resolve => resolve(serverError()))
    }
  }
}
