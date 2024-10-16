import { Express } from 'express'
import bodyParser from '../middlewares/body-parser/body-parser'
import cors from '../middlewares/cors/cors'
import morgan from '../middlewares/morgan/morgan'

export default (app: Express) => {
  app.use(bodyParser)
  app.use(cors)
  app.use(morgan)
}
