import { MissingParamError } from "../errors/missing-param-error"
import { RequiredFieldParam } from "./required-field-param"

describe('RequiredFieldParam', () => {
  it('Should return an error if field not found', () => {
    const sut = new RequiredFieldParam('field')
    const error = sut.validate({ other_field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})