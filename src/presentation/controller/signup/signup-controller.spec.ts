import { IValidation } from '../../protocols/validation'
import { SignUpController } from './signup-controller'
import {
  HttpRequest,
  badRequest,
  ok,
  serverError,
  EmailAlreadyExistError
} from './signup-controller-protocols'
import { IAccount } from '../../../domain/protocols/account'
import {
  IAddAccount,
  IAddAccountModel
} from '../../../domain/usecases/users/add-account'
import { ILoadAccountByEmail } from '../../../domain/usecases/users/load-account'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
    confirmPassword: 'any_password'
  }
})

interface SutTypes {
  sut: SignUpController
  validationStub: IValidation
  addAccountStub: IAddAccount
  loadAccountStub: ILoadAccountByEmail
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const addAccountStub = makeAddAccountStub()
  const loadAccountStub = makeLoadAccountStub()
  const sut = new SignUpController(
    validationStub,
    addAccountStub,
    loadAccountStub
  )
  return {
    sut,
    validationStub,
    addAccountStub,
    loadAccountStub
  }
}

const makeLoadAccountStub = (): ILoadAccountByEmail => {
  class LoadAccountStub implements ILoadAccountByEmail {
    async load(email: string): Promise<IAccount | null> {
      return Promise.resolve(null)
    }
  }
  return new LoadAccountStub()
}

const makeAddAccountStub = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: IAddAccountModel): Promise<IAccount> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(data: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeAccount = (): IAccount => ({
  email: 'any_mail@mail.com',
  name: 'any_name',
  password: 'any_password',
  id: 'any_id'
})

describe('SignUpController', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validationSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
  it('Should return a 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new Error('any_error'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_error')))
  })
  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
  })
  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError())
  })
  it('Should return 200 on AddAccount succeed', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
  it('Should call loadAccount with correct values', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
  it('Should return an EmailAlreadyExist if loadAccount returns an account', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest
      .spyOn(loadAccountStub, 'load')
      .mockReturnValueOnce(Promise.resolve(makeFakeAccount()))
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(badRequest(new EmailAlreadyExistError()))
  })
  it('Should return 500 if loadAccount throws', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(serverError())
  })
})
