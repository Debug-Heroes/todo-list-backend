/* eslint-disable @typescript-eslint/no-unused-vars */
 
import { IValidation } from '../../../domain/protocols/validation'
import { SignUpController } from './signup-controller'
import { HttpRequest, badRequest, ok, serverError } from './signup-controller-protocols'
import { IAccount } from '../../../domain/protocols/account'
import { IAddAccount, IAddAccountModel } from '../../../domain/usecases/users/add-account'

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
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(validationStub, addAccountStub)
  return {
    sut,
    validationStub,
    addAccountStub
  }
}

const makeAddAccountStub = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: IAddAccountModel): Promise<IAccount> {
        return new Promise(resolve => resolve({
          id: 'any_id',
          name: 'any_name',
          email: 'any_mail@mail.com',
          password: 'any_hash'
        }))
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
    password: 'any_password',
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
      expect(httpResponse).toEqual(ok({
        id: 'any_id',
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_hash'
      }))
  })
})
