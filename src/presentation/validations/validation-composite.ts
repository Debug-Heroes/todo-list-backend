 
import { IValidation } from '../../domain/protocols/validation'

export class ValidationComposite implements IValidation {
  constructor(private readonly validators: IValidation[]) {}
  validate(data: any): Error | null {
    for (const validator of this.validators) {
      const error = validator.validate(data)
      if (error) {
        return error
      }
    }
    return null
  }
}
