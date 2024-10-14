/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IValidation } from '../../../domain/protocols/validation'
import { SignUpController } from './signup-controller'
import { HttpRequest, badRequest } from './signup-controller-protocols'
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
})