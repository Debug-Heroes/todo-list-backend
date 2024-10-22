import { IGetAllCategories } from '../../../../domain/usecases/categories/get-all-categories'
import { serverError } from '../../../helpers/http-helper'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'

export class GetAllCategoriesController implements Controller {
  constructor(private readonly getAllCategories: IGetAllCategories) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.getAllCategories.getAll()
      return Promise.resolve({ statusCode: 200 })
    } catch (error) {
      return new Promise(resolve => resolve(serverError()))
    }
  }
}
