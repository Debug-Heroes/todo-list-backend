import { Express, Router } from 'express'
import fs from 'fs'

export default (app: Express) => {
  const authRoutes = Router()
  const apiRoutes = Router()

  for (const route of ['signup', 'login', 'delete-account']) {
    fs.readdirSync(`${__dirname}/../routes/users/${route}`).map(async (file) => {
      if (!file.includes('test') && !file.includes('map')) {
        (await import(`../routes/${route}/users/${file}`)).default(authRoutes)
      }
    })
  }

  for (const route of ['categories']) {
    fs.readdirSync(`${__dirname}/../routes/${route}`).map(async (file) => {
      if (!file.includes('test') && !file.includes('map')) {
        (await import(`../routes/${route}/${file}`)).default(apiRoutes)
      }
    })
  }

  app.use('/', authRoutes)
  app.use('/api', apiRoutes)
}
