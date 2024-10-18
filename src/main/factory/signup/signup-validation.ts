import { IValidation } from '../../../presentation/protocols/validation'
import { CompareFieldsValidation } from '../../../presentation/validations/compare-fields-validation'
import { EmailValidation } from '../../../presentation/validations/email-validation'
import { RequiredFieldValidation } from '../../../presentation/validations/required-field-validation'
import { ValidationComposite } from '../../../presentation/validations/validation-composite'
import { EmailValidator } from '../../../utils/email-validator/email-validator'

export const makeSignUpValidation = (): ValidationComposite => {
  const validators: IValidation[] = []
  for (const pos of ['name', 'email', 'password', 'confirmPassword']) {
    validators.push(new RequiredFieldValidation(pos))
  }
  validators.push(new EmailValidation(new EmailValidator()))
  validators.push(new CompareFieldsValidation('password', 'confirmPassword'))
  return new ValidationComposite(validators)
}
