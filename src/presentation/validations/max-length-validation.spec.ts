import { CharactersLimitReached } from '../errors/characters-limit-reached-error'
import { MaxLengthValidation } from './max-length-validation'

describe('MaxLengthValidation', () => {
  it('Should return an CharactersLimitReached if field exceeded the limit', () => {
    const sut = new MaxLengthValidation('field', 5)
    const result = sut.validate({ field: 'any_value' })
    expect(result).toEqual(new CharactersLimitReached())
  })
  it('Should not return if limit was not reach', () => {
    const sut = new MaxLengthValidation('email', 100)
    const result = sut.validate({ email: 'any_longmail@ultramail.com' })
    expect(result).toBeFalsy()
  })
})
