import { NextFunction, Request, Response } from 'express'
import { Controller } from '../../presentation/protocols/controller'

export default (middleware: Controller) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const response = await middleware.handle(req.body)
    if (response.statusCode === 200) return next()
    return res.status(response.statusCode).json(response.body)
  }
}
