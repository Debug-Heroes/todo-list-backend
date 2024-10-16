/* eslint-disable @typescript-eslint/no-unused-vars */
import { IValidation } from "../../../domain/usecases/users/validation"
import { HttpRequest } from "../signup/signup-controller-protocols"
import { LoginController } from './login-controller'

interface SutTypes {
  sut: LoginController
  validationStub: IValidation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new LoginController(validationStub)
  return {
    sut,
    validationStub
  }
}


const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(data: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_mail@mail.com',
    password: 'any_password'
  }
})

describe('LoginController', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
})