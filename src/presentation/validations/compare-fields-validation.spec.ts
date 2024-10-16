import { InvalidParamError } from '../errors/invalid-param-error'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('CompareFieldsValidation', () => {
  it('Should return an error if comparison fails', () => {
    const sut = new CompareFieldsValidation('any_field', 'second_field')
    const result = sut.validate({
      any_field: 'any_value',
      second_field: 'other_value'
    })
    expect(result).toEqual(new InvalidParamError('second_field'))
  })
  it('Should not return if comparison succeed', () => {
    const sut = new CompareFieldsValidation('any_field', 'second_field')
    const result = sut.validate({
      any_field: 'any_value',
      second_field: 'any_value'
    })
    expect(result).toBeFalsy()
  })
})
