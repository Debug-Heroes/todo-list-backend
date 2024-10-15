import { Request, Response } from 'express'
import app from '../../config/app'
import request from 'supertest'

describe('Morgan', () => {
  it('Should log the request information', async () => {
    app.post('/test_morgan', (req: Request, res: Response) => {
      res.send({})
    })
    await request(app)
      .post('/test_morgan')
      .send({})
      .set('Origin', 'https://anysitefrominternet.com')
      .expect(200)
  })
})