import { IValidation } from '../../../domain/protocols/validation'
import { RequiredFieldValidation } from '../../../presentation/validations/required-field-validation'
import { ValidationComposite } from '../../../presentation/validations/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  const validators: IValidation[] = []
  for (const pos of ['name', 'email', 'password', 'confirmPassword']) {
    validators.push(new RequiredFieldValidation(pos))
  }
  return new ValidationComposite(validators)
}
