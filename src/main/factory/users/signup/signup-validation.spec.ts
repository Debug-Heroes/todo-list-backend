import { IValidation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../presentation/validations/validation-composite'
import { RequiredFieldValidation } from '../../../../presentation/validations/required-field-validation'
import { makeSignUpValidation } from './signup-validation'
import { EmailValidation } from '../../../../presentation/validations/email-validation'
import { CompareFieldsValidation } from '../../../../presentation/validations/compare-fields-validation'
import { EmailValidator } from '../../../../utils/email-validator/email-validator'

jest.mock('../../../../presentation/validations/validation-composite')

describe('SignUpValidation', () => {
  it('Should call ValidationComposite with correct values', async () => {
    makeSignUpValidation()
    const validations: IValidation[] = []
    for (const pos of ['name', 'email', 'password', 'confirmPassword']) {
      validations.push(new RequiredFieldValidation(pos))
    }
    validations.push(new EmailValidation(new EmailValidator()))
    validations.push(new CompareFieldsValidation('password', 'confirmPassword'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
