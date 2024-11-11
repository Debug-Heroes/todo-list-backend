import { IValidation } from '@presentation/protocols/validation'
import { RequiredFieldValidation } from '@presentation/validations/required-field-validation'
import { ValidationComposite } from '@presentation/validations/validation-composite'
import { makeGetTasksByCategoryValidation } from './get-tasks-by-category-validation'

jest.mock('@presentation/validations/validation-composite')

describe('makeGetTasksByCategoryValidation', () => {
  it('Should call ValidationComposite with correct values', async () => {
    makeGetTasksByCategoryValidation()
    const validations: IValidation[] = []
    validations.push(new RequiredFieldValidation('user_id'))
    validations.push(new RequiredFieldValidation('category_id'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
