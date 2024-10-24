import { IValidation } from '../../../../presentation/protocols/validation'
import { EmailValidation } from '../../../../presentation/validations/email-validation'
import { RequiredAtLeastOneIn } from '../../../../presentation/validations/required-at-least-one-in'
import { ValidationComposite } from '../../../../presentation/validations/validation-composite'
import { EmailValidator } from '../../../../utils/email-validator/email-validator'

export const makeUpdateValidation = (): IValidation => {
  const validations: IValidation[] = []
  const fields = ['name', 'email']
  validations.push(new RequiredAtLeastOneIn(fields))
  validations.push(new EmailValidation(new EmailValidator()))
  return new ValidationComposite(validations)
}
