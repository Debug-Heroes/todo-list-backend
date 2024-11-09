import { IValidation } from '@presentation/protocols/validation'
import { RequiredFieldValidation } from '@presentation/validations/required-field-validation'
import { ValidationComposite } from '@presentation/validations/validation-composite'

export const makeGetTasksByCategoryValidation = (): ValidationComposite => {
  const validators: IValidation[] = []
  for (const pos of ['userId', 'categoryId']) {
    validators.push(new RequiredFieldValidation(pos))
  }
  return new ValidationComposite(validators)
}
