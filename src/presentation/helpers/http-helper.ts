import { HttpResponse } from '../protocols/http'
import { AccessDeniedError } from '../errors/access-denied-error'
import { ServerError } from '../errors/server-error'
import { Unauthorized } from '../errors/unauthorized-error'
import { NotFoundError } from '../errors/not-found-error'

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError().message
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error.message
})
export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new Unauthorized().message
})
export const forbidden = (): HttpResponse => ({
  statusCode: 403,
  body: new AccessDeniedError().message
})
export const NotFound = (): HttpResponse => ({
  statusCode: 404,
  body: new NotFoundError().message
})
