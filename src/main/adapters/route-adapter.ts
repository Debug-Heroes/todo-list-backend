import { Request, Response } from 'express'
import { Controller } from '../../presentation/protocols/controller'

export default (controller: Controller) => {
  return async (req: Request, res: Response): Promise<any> => {
    const response = await controller.handle(req)
    return res.status(response.statusCode).json(response.body)
  }
}
