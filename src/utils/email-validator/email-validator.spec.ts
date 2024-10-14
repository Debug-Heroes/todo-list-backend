import validator from "validator"
import { EmailValidator } from './email-validator'

describe('EmailValidator', () => {
  it('Should call isEmail with correct values', () => {
    const sut = new EmailValidator()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_mail@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
})