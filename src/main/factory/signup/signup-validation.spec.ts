import { IValidation } from "../../../domain/protocols/validation"
import { ValidationComposite } from "../../../presentation/validations/validation-composite"
import { RequiredFieldValidation } from '../../../presentation/validations/required-field-validation'
import { makeSignUpValidation } from './signup-validation'

jest.mock("../../../presentation/validations/validation-composite")

describe('SignUpValidation', () => {
  it('Should call ValidationComposite with correct values', async () => {
    makeSignUpValidation()
    const validations: IValidation[] = []
    for (const pos of ['name', 'email', 'password', 'confirmPassword']) {
      validations.push(new RequiredFieldValidation(pos))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})