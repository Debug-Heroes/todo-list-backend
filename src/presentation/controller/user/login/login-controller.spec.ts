import {
  badRequest,
  HttpRequest,
  ok,
  IValidation,
  unauthorized
} from '../login/login-controller-protocols'
import { LoginController } from './login-controller'
import {
  IAuthentication,
  IAuthenticationModel
} from '../../../../domain/usecases/users/authentication'

interface SutTypes {
  sut: LoginController
  validationStub: IValidation
  authenticationStub: IAuthentication
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    validationStub,
    authenticationStub
  }
}

const makeAuthenticationStub = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(account: IAuthenticationModel): Promise<string | null> {
      return Promise.resolve('any_token')
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
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new Error('any_error'))
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
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(unauthorized())
  })
  it('Should return token on succeed', async () => {
    const { sut } = makeSut()
    const token = await sut.handle(makeFakeRequest())
    expect(token).toEqual(ok('any_token'))
  })
})
