/* eslint-disable @typescript-eslint/no-unused-vars */
import { IValidation } from "../../domain/protocols/validation"
import { IEmailValidator } from "../protocols/email-validator"
import { EmailValidation } from './email-validation'

interface SutTypes {
  sut: IValidation
  emailValidatorStub: IEmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidation(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

const makeEmailValidatorStub = (): IEmailValidator => {
  class EmailValidator implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidator()
}

describe('EmailValidation', () => {
  it('Should call emailValidator with correct values', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_email' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email')
  })
})