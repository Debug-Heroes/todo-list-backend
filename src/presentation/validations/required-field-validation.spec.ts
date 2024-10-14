import { MissingParamError } from "../errors/missing-param-error"
import { RequiredFieldValidation } from "./required-field-validation"

describe('RequiredFieldValidation', () => {
  it('Should return an error if field not found', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ other_field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})