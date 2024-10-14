import validator from "validator"
import { EmailValidator } from './email-validator'

jest.mock('validator', () => ({
  isEmail: () => {
    return true
  }
}))

describe('EmailValidator', () => {
  it('Should call isEmail with correct values', () => {
    const sut = new EmailValidator()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_mail@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
  it('Should throw if isEmail throws', () => {
    const sut = new EmailValidator()
    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.isValid).toThrow()
  })
  it('Should return false if isEmail fails', () => {
    const sut = new EmailValidator()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const result = sut.isValid('invalid_mail')
    expect(result).toBeFalsy()
  })
  it('Should return true if isEmail succeed', () => {
    const sut = new EmailValidator()
    const result = sut.isValid('valid_mail@mail.com')
    expect(result).toBeTruthy()
  })
})