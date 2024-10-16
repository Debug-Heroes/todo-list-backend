import { IValidation } from '../../domain/usecases/users/validation'
import { InvalidParamError } from '../errors/invalid-param-error'

export class CompareFieldsValidation implements IValidation {
  constructor(
    private readonly fieldOne: string,
    private readonly fieldSec: string
  ) {}
  validate(data: any): Error | null {
    if (data[this.fieldOne] !== data[this.fieldSec])
      return new InvalidParamError(this.fieldSec)
    return null
  }
}
