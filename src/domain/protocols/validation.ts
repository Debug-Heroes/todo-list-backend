/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IValidation {
  validate(data: any): Error | null
}