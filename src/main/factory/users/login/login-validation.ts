import { IValidation } from '../../../../presentation/protocols/validation'
import { EmailValidation } from '../../../../presentation/validations/email-validation'
import { RequiredFieldValidation } from '../../../../presentation/validations/required-field-validation'
import { ValidationComposite } from '../../../../presentation/validations/validation-composite'
import { EmailValidator } from '../../../../utils/email-validator/email-validator'

export const makeLoginValidation = (): ValidationComposite => {
  const validators: IValidation[] = []
  for (const pos of ['email', 'password']) {
    validators.push(new RequiredFieldValidation(pos))
  }
  validators.push(new EmailValidation(new EmailValidator()))
  return new ValidationComposite(validators)
}
