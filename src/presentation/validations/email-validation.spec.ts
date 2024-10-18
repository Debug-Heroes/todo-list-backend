import { IValidation } from '../protocols/validation'
import { InvalidParamError } from '../errors/invalid-param-error'
import { IEmailValidator } from '../protocols/email-validator'
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
  it('Should return an InvalidParamError if emailValidator fails', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const result = sut.validate({ email: 'any_mail@mail.com' })
    expect(result).toEqual(new InvalidParamError('email'))
  })
  it('Should not return if emailValidator succeed', () => {
    const { sut } = makeSut()
    const result = sut.validate({ email: 'any_mail@mail.com' })
    expect(result).toBeFalsy()
  })
  it('Should throw if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
