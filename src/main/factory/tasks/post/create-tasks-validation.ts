import { IValidation } from '@presentation/protocols/validation'
import { RequiredFieldValidation } from '@presentation/validations/required-field-validation'
import { ValidationComposite } from '@presentation/validations/validation-composite'

export const makeCreateTasksValidation = (): IValidation => {
  const validators: IValidation[] = []
  for (const pos of ['name', 'text', 'user_id']) {
    validators.push(new RequiredFieldValidation(pos))
  }
  return new ValidationComposite(validators)
}
