import { IGetAllCategories } from '../../../../domain/usecases/categories/get-all-categories'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'

export class GetAllCategoriesController implements Controller {
  constructor(private readonly getAllCategories: IGetAllCategories) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.getAllCategories.getAll()
    return Promise.resolve({ statusCode: 200 })
  }
}
