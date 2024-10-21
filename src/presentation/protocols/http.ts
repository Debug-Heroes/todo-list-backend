export interface HttpRequest {
  body?: any
  headers?: any
  user?: any
  query?: any
}

export interface HttpResponse {
  body?: any
  statusCode: number
}
