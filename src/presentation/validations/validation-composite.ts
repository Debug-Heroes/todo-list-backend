/* eslint-disable @typescript-eslint/no-explicit-any */
import { IValidation } from '../../domain/protocols/validation'

export class ValidationComposite implements IValidation {
  constructor(private readonly validators: IValidation[]) {}
  validate(data: any): Error | null {
    let error
    this.validators.forEach((validator) => {
      error = validator.validate(data)
    })
    return error ? error : null
  }
}
