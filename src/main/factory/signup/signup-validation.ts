import { IValidation } from '../../../domain/protocols/validation'
import { RequiredFieldParam } from '../../../presentation/validations/required-field-param'
import { ValidationComposite } from '../../../presentation/validations/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  const validators: IValidation[] = []
  for (const pos of ['name', 'email', 'password', 'confirmPassword']) {
    validators.push(new RequiredFieldParam(pos))
  }
  return new ValidationComposite(validators)
}
