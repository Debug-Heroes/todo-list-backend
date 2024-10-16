import { Express, Router } from 'express'
import fs from 'fs'

export default (app: Express) => {
  const router = Router()

  fs.readdirSync(`${__dirname}/../routes/signup`).map(async (file) => {
    if (!file.includes('test') && !file.includes('map')) {
      (await import(`../routes/signup/${file}`)).default(router)
      console.log(file)
    }
  })

  app.use('/', router)
}
