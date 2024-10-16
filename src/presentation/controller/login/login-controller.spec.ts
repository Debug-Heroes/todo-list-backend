/* eslint-disable @typescript-eslint/no-unused-vars */
import { IValidation } from "../../../domain/usecases/users/validation"
import { badRequest, HttpRequest, unauthorized } from "../signup/signup-controller-protocols"
import { LoginController } from './login-controller'
import { IAuthentication, IAuthenticationModel } from '../../../domain/usecases/users/authentication'
import { IAccount } from "../../../domain/protocols/account"
import { IEncrypter } from "../../../data/protocols/encrypter"

interface SutTypes {
  sut: LoginController
  validationStub: IValidation
  authenticationStub: IAuthentication
  encrypterStub: IEncrypter
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const authenticationStub = makeAuthenticationStub()
  const encrypterStub = makeEncrypterStub()
  const sut = new LoginController(validationStub, authenticationStub, encrypterStub)
  return {
    sut,
    validationStub,
    authenticationStub,
    encrypterStub
  }
}

const makeEncrypterStub = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    encrypt(anyValue: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new EncrypterStub()
}

const makeAuthenticationStub = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(account: IAuthenticationModel): Promise<IAccount> {
      return Promise.resolve({
        email: 'any_mail@mail.com',
        id: 'any_id',
        name: 'any_name',
        password: 'any_password'
      })
    }
  }
  return new AuthenticationStub()
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
  it('Should return a 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(badRequest(new Error('any_error')))
  })
  it('Should call auth with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
  it('Should return 401 if auth fails', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(unauthorized())
  })
  it('Should call encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.handle(makeFakeRequest())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })
})