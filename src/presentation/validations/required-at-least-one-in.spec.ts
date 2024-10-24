import { MissingParamError } from '../errors/missing-param-error'
import { RequiredAtLeastOneIn } from './required-at-least-one-in'

describe('RequiredAtLeastOneIn', () => {
  it('Should return an error if not found at least one in array', () => {
    const sut = new RequiredAtLeastOneIn(['field'])
    const result = sut.validate({ anotherField: 'any_value' })
    expect(result).toEqual(new MissingParamError('to change'))
  })
})
