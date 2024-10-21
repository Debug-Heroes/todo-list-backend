import { Express, Router } from 'express'
import fs from 'fs'

export default (app: Express) => {
  const router = Router()

  for (const route of ['signup', 'login', 'delete-account']) {
    fs.readdirSync(`${__dirname}/../routes/${route}`).map(async (file) => {
      if (!file.includes('test') && !file.includes('map')) {
        (await import(`../routes/${route}/${file}`)).default(router)
      }
    })
  }

  app.use('/', router)
}
