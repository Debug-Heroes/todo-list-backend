import { IValidation } from '../../../presentation/protocols/validation'
import { RequiredAtLeastOneIn } from '../../../presentation/validations/required-at-least-one-in'
import { ValidationComposite } from '../../../presentation/validations/validation-composite'
import { makeGetByValidation } from './get-by-validation'

jest.mock('../../../presentation/validations/validation-composite')

describe('LoginValidation', () => {
  it('Should call  ValidationComposite with correct values', async () => {
    makeGetByValidation()
    const validations: IValidation[] = []
    validations.push(new RequiredAtLeastOneIn(['name']))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
