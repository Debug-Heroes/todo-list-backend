import { HttpRequest } from '../../../protocols/http'
import { IValidation } from '../../../protocols/validation'
import { badRequest, NotFound, ok, serverError } from '../../signup/signup-controller-protocols'
import { DeleteUserController } from './delete-user-controller'
import { ILoadAccountById } from '../../../../domain/usecases/users/load-account-by-id'
import { IAccount } from '../../../../domain/protocols/account'
import { IDeleteAccount } from '../../../../domain/usecases/users/delete-account'

interface SutTypes {
  sut: DeleteUserController
  validationStub: IValidation
  loadAccountByIdStub: ILoadAccountById
  dbDeleteAccountStub: IDeleteAccount
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const loadAccountByIdStub = makeLoadAccountStub()
  const dbDeleteAccountStub = makeDbDeleteAccountStub()
  const sut = new DeleteUserController(validationStub, loadAccountByIdStub, dbDeleteAccountStub)
  return {
    sut,
    validationStub,
    loadAccountByIdStub,
    dbDeleteAccountStub
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
    async loadById(id: string): Promise<IAccount | null> {
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

const makeDbDeleteAccountStub = (): IDeleteAccount => {
  class DeleteAccountStub implements IDeleteAccount {
    async delete(id: string): Promise<string> {
      return new Promise(resolve => resolve('1 row affected'))
    }
  }
  return new DeleteAccountStub()
}

const makeFakeRequest = (): HttpRequest => ({
  query: {
    id: 'any_id'
  }
})

describe('DeleteUserController', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().query)
  })
  it('Should return a 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new Error('any_error')))
  })
  it('Should call loadAccountById with correct values', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
  it('Should return 404 if loadAccountById fails', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    jest.spyOn(loadAccountByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(NotFound())
  })
  it('Should return 500 if loadAccountById throws', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    jest.spyOn(loadAccountByIdStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })
  it('Should call DbDeleteAccount with correct values', async () => {
    const { sut, dbDeleteAccountStub } = makeSut()
    const deleteSpy = jest.spyOn(dbDeleteAccountStub, 'delete')
    await sut.handle(makeFakeRequest())
    expect(deleteSpy).toHaveBeenCalledWith('any_id')
  })
  it('Should return 500 if DbDeleteAccount throws', async () => {
    const { sut, dbDeleteAccountStub } = makeSut()
    jest.spyOn(dbDeleteAccountStub, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError())
  })
  it('Should return affected rows on DbDeleteAccount succeed', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok('1 row affected'))
  })
})