import { Request, Response } from 'express'
import app from '../../config/app'
import request from 'supertest'

describe('BodyParser', () => {
  it('Should parse body as json', async () => {
    app.post('/body_parser_test', (req: Request, res: Response) => {
      res.send(req.body)
    })

    await request(app)
      .post('/body_parser_test')
      .send({ field: 'any_field' })
      .expect({ field: 'any_field' })
  })
})