import { Express, Router } from 'express'
import fs from 'fs'

export default (app: Express) => {
  const authRoutes = Router()
  const apiRoutes = Router()

  for (const route of ['signup', 'login', 'delete-account', 'update-account']) {
    fs.readdirSync(`${__dirname}/../routes/users/${route}`).map(async (file) => {
      if (!file.includes('test') && !file.includes('map')) {
        (await import(`../routes/users/${route}/${file}`)).default(authRoutes)
      }
    })
  }
  
  for (const route of ['tasks']) {
    for (const path of ['get', 'post']) {
      fs.readdirSync(`${__dirname}/../routes/${route}/${path}/`).map(async (file) => {
        if (!file.includes('test') && !file.includes('map')) {
          (await import(`../routes/${route}/${path}/${file}`)).default(apiRoutes)
        }
      })
    }
  }

  for (const route of ['categories']) {
    for (const path of ['get']) {
      fs.readdirSync(`${__dirname}/../routes/${route}/${path}`).map(async (file) => {
        if (!file.includes('test') && !file.includes('map')) {
          (await import(`../routes/${route}/${path}/${file}`)).default(apiRoutes)
        }
      })
    }
  }

  app.use('/', authRoutes)
  app.use('/api', apiRoutes)
}
