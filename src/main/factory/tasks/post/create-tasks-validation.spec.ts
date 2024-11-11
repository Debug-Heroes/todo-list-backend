import { IValidation } from '@presentation/protocols/validation'
import { RequiredFieldValidation } from '@presentation/validations/required-field-validation'
import { ValidationComposite } from '@presentation/validations/validation-composite'
import { makeCreateTasksValidation } from './create-tasks-validation'

jest.mock('@presentation/validations/validation-composite')

describe('makeCreateTasksValidation', () => {
  it('Should call ValidationComposite with correct values', async () => {
    makeCreateTasksValidation()
    const validations: IValidation[] = []
    for (const pos of ['name', 'text', 'user_id']) {
      validations.push(new RequiredFieldValidation(pos))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
