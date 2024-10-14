/* eslint-disable @typescript-eslint/no-unused-vars */
import { IValidation } from '../../domain/protocols/validation'
import { InvalidParamError } from '../errors/invalid-param-error'

export class CompareFieldsValidation implements IValidation {
  constructor(
    private readonly fieldOne: string,
    private readonly fieldSec: string
  ) {}
  validate(data: any): Error | null {
    return new InvalidParamError(this.fieldSec)
  }
}
