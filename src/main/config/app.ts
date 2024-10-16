import express from 'express'
import middlewares from './middlewares'
import routes from './routes'
import middlewareAdapter from '../adapters/middleware-adapter'
import { makeAuthMiddleware } from '../factory/auth-middleware/auth-middleware-factory'
const app = express()

middlewares(app)
routes(app)
app.use(middlewareAdapter(makeAuthMiddleware()) as any)

export default app
