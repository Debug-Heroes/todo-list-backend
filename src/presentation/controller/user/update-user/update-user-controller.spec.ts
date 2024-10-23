import { UpdateUserController } from './update-user-controller'
import { badRequest, forbidden, IValidation, HttpRequest, serverError, ok } from './update-user-protocols'
import { IUpdateAccount, UpdateAccountModel } from '../../../../domain/usecases/users/update-account'
import { IAccount } from '../../../../domain/protocols/account'

interface SutTypes {
  sut: UpdateUserController
  validationStub: IValidation
  dbUpdateUserStub: IUpdateAccount
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const dbUpdateUserStub = makeDbUpdateUserStub()
  const sut = new UpdateUserController(validationStub, dbUpdateUserStub)
  return {
    sut,
    validationStub,
    dbUpdateUserStub
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


const makeDbUpdateUserStub = (): IUpdateAccount => {
  class UpdateUserStub implements IUpdateAccount {
    async update(values: UpdateAccountModel): Promise<IAccount> {
      return Promise.resolve({
        id: 'any_id',
        name: 'updated_name',
        email: 'any_mail@mail.com',
        password: 'any_password'
      })
    }
  }
  return new UpdateUserStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    id: 'any_id',
    name: 'updated_name'
  },
  user: 'any_id'
})

describe('UpdateUserController', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
  it('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(badRequest(new Error('any_error')))
  })
  it('Should return 403 if received id and user id are different', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({body: {id: 'different_id'}, user: 'any_id'})
    expect(result).toEqual(forbidden())
  })
  it('Should call DbUpdateUser with correct values', async () => {
    const { sut, dbUpdateUserStub } = makeSut()
    const updateSpy = jest.spyOn(dbUpdateUserStub, 'update')
    await sut.handle(makeFakeRequest())
    expect(updateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
  it('Should return 500 if DbUpdateUser throws', async () => {
    const { sut, dbUpdateUserStub } = makeSut()
    jest.spyOn(dbUpdateUserStub, 'update').mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(serverError())
  })
  it('Should return an account on DbUpdateUser succeed', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(ok({
      id: 'any_id',
      name: 'updated_name',
      email: 'any_mail@mail.com',
      password: 'any_password'
    }))
  })
})