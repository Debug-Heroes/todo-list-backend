import { IValidation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/validations/validation-composite'
import { RequiredFieldValidation } from '../../../presentation/validations/required-field-validation'
import { makeLoginValidation } from './login-validation'
import { EmailValidation } from '../../../presentation/validations/email-validation'
import { EmailValidator } from '../../../utils/email-validator/email-validator'

jest.mock('../../../presentation/validations/validation-composite')

describe('LoginValidation', () => {
  it('Should call  ValidationComposite with correct values', async () => {
    makeLoginValidation()
    const validations: IValidation[] = []
    for (const pos of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(pos))
    }
    validations.push(new EmailValidation(new EmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
