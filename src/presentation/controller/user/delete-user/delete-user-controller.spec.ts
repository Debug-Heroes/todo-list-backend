/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpRequest } from '../../../protocols/http'
import { IValidation } from '../../../protocols/validation'
import { badRequest, NotFound, serverError } from '../../signup/signup-controller-protocols'
import { DeleteUserController } from './delete-user-controller'
import { ILoadAccountById } from '../../../../domain/usecases/users/load-account-by-id'
import { IAccount } from '../../../../domain/protocols/account'

interface SutTypes {
  sut: DeleteUserController
  validationStub: IValidation
  loadAccountByIdStub: ILoadAccountById
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const loadAccountByIdStub = makeLoadAccountStub()
  const sut = new DeleteUserController(validationStub, loadAccountByIdStub)
  return {
    sut,
    validationStub,
    loadAccountByIdStub
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

const makeLoadAccountStub = (): ILoadAccountById => {
  class LoadAccountByIdStub implements ILoadAccountById {
    async load(id: string): Promise<IAccount | null> {
      return new Promise(resolve => resolve({
        email: 'any_mail@mail.com',
        password: 'any_hash',
        id: 'any_id',
        name: 'any_name'
      }))
    }
  }
  return new LoadAccountByIdStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    id: 'any_id'
  }
})

describe('DeleteUserController', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
  it('Should return a 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new Error('any_error')))
  })
  it('Should call loadAccountById with correct values', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByIdStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
  it('Should return 404 if loadAccountById fails', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    jest.spyOn(loadAccountByIdStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(NotFound())
  })
})