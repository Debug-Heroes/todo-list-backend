/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from "../protocols/http";

export const badRequest = (error: any): HttpResponse => ({ 
  statusCode: 400,
  body: error
})