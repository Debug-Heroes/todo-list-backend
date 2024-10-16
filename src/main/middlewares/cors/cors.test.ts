import { NextFunction, Request, Response } from 'express'
import app from '../../config/app'
import request from 'supertest'

jest.mock('../../adapters/middleware-adapter', () => () => async (req: Request, res: Response, next: NextFunction) => next())

describe('cors', () => {
  it('Should access-control-allow-origin to be *', async () => {
    app.get('/test_cors', (req: Request, res: Response) => {
      res.send(req.body)
    })

    const response = await request(app)
      .get('/test_cors')
      .set('Origin', 'https://anyurlfrominternet.com')
    expect(response.statusCode).toBe(200)
    expect(response.headers['access-control-allow-origin']).toBe('*')
  })
})
