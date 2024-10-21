import { IValidation } from '../../../presentation/protocols/validation'
import { RequiredFieldValidation } from '../../../presentation/validations/required-field-validation'
import { ValidationComposite } from '../../../presentation/validations/validation-composite'

export const makeDeleteValidation = (): IValidation => {
  const validations: IValidation[] = []
  validations.push(new RequiredFieldValidation('id'))
  return new ValidationComposite(validations)
}
