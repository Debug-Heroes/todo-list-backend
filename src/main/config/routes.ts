import { Express, Router } from 'express'
import fs from 'fs'

export default (app: Express) => {
  const router = Router()

  for (const route of ['signup', 'login', 'delete-account']) {
    fs.readdirSync(`${__dirname}/../routes/users/${route}`).map(async (file) => {
      if (!file.includes('test') && !file.includes('map')) {
        (await import(`../routes/users/${route}/${file}`)).default(router)
      }
    })
  }
  
  for (const route of ['tasks']) {
    for (const path of ['get']) {
      fs.readdirSync(`${__dirname}/../routes/${route}/${path}/`).map(async (file) => {
        if (!file.includes('test') && !file.includes('map')) {
          (await import(`../routes/${route}/${path}/${file}`)).default(router)
        }
      })
    }
  }

  app.use('/', router)
}
