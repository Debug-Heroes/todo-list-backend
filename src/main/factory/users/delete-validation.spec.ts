import { IValidation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/validations/validation-composite'
import { RequiredFieldValidation } from '../../../presentation/validations/required-field-validation'
import { makeDeleteValidation } from './delete-validation'

jest.mock('../../../presentation/validations/validation-composite')

describe('DeleteValidation', () => {
  it('Should call ValidationComposite with correct values', async () => {
    makeDeleteValidation()
    const validations: IValidation[] = []
    for (const pos of ['id']) {
      validations.push(new RequiredFieldValidation(pos))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
