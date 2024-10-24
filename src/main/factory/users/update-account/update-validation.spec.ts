import { IValidation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../presentation/validations/validation-composite'
import { makeUpdateValidation } from './update-validation'
import { EmailValidation } from '../../../../presentation/validations/email-validation'
import { EmailValidator } from '../../../../utils/email-validator/email-validator'
import { RequiredAtLeastOneIn } from '../../../../presentation/validations/required-at-least-one-in'

jest.mock('../../../../presentation/validations/validation-composite')

describe('UpdateValidation', () => {
  it('Should call ValidationComposite with correct values', async () => {
    makeUpdateValidation()
    const validations: IValidation[] = []
    const requiredFields = [
      'name',
      'email'
    ]
    validations.push(new RequiredAtLeastOneIn(requiredFields))
    validations.push(new EmailValidation(new EmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
