import { Express } from "express"
import bodyParser from "../middlewares/body-parser/body-parser"

export default (app: Express) => {
  app.use(bodyParser)
}