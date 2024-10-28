import { IValidation } from '../../../presentation/protocols/validation'
import { RequiredAtLeastOneIn } from '../../../presentation/validations/required-at-least-one-in'
import { ValidationComposite } from '../../../presentation/validations/validation-composite'

export const makeGetByValidation = (): ValidationComposite => {
  const validators: IValidation[] = []
  validators.push(new RequiredAtLeastOneIn(['name']))
  return new ValidationComposite(validators)
}
