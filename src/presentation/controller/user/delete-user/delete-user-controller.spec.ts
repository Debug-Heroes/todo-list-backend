/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpRequest } from '../../../protocols/http'
import { IValidation } from '../../../protocols/validation'
import { badRequest } from '../../signup/signup-controller-protocols'
import { DeleteUserController } from './delete-user-controller'
import { ILoadAccountById } from '../../../../domain/usecases/users/load-account-by-id'
import { IAccount } from '../../../../domain/protocols/account'

interface SutTypes {
  sut: DeleteUserController
  validationStub: IValidation
  loadUserByIdStub: ILoadAccountById
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const loadUserByIdStub = makeLoadUserStub()
  const sut = new DeleteUserController(validationStub, loadUserByIdStub)
  return {
    sut,
    validationStub,
    loadUserByIdStub
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

const makeLoadUserStub = (): ILoadAccountById => {
  class LoadUserByIdStub implements ILoadAccountById {
    async load(id: string): Promise<IAccount | null> {
      return new Promise(resolve => resolve({
        email: 'any_mail@mail.com',
        password: 'any_hash',
        id: 'any_id',
        name: 'any_name'
      }))
    }
  }
  return new LoadUserByIdStub()
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
  it('Should call loadUserById with correct values', async () => {
    const { sut, loadUserByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadUserByIdStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
})