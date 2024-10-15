/* eslint-disable @typescript-eslint/no-unused-vars */
import { IHasher } from '../../../protocols/hasher'
import { IAddAccountRepository } from '../../../protocols/add-account-repository'
import { IAddAccountModel } from '../../../../domain/usecases/users/add-account'
import { IAccount } from '../../../../domain/protocols/account'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  hasherStub: IHasher
  AddAccountRepositoryStub: IAddAccountRepository
}

const makeSut = (): SutTypes => {
  const AddAccountRepositoryStub = makeAddAccountRepositoryStub()
  const hasherStub = makeHasherStub()
  const sut = new DbAddAccount(hasherStub, AddAccountRepositoryStub)
  return {
    sut,
    hasherStub,
    AddAccountRepositoryStub
  }
}

const makeHasherStub = (): IHasher => {
  class HasherStub implements IHasher {
    hash(value: string): Promise<string> {
      return Promise.resolve('hash_value')
    }
  }
  return new HasherStub()
}

const makeAddAccountRepositoryStub = (): IAddAccountRepository   => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    add(account: IAddAccountModel): Promise<IAccount> {
      return Promise.resolve({
        email: 'any_mail@mail.com',
        id: 'any_id',
        name: 'any_name',
        password: 'hash_password'
      })
    }
  }
  return new AddAccountRepositoryStub()
}

const makeFakeRequest = (): IAddAccountModel => ({
  email: 'any_mail@mail.com',
  password: 'any_password',
  name: 'any_name'
})

describe('DbAddAccount', () => {
  it('Should call encrypter with correct values', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    const request = makeFakeRequest()
    await sut.add(request)
    expect(encryptSpy).toHaveBeenCalledWith(request.password)
  })
  it('Should throw if encrypter throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add(makeFakeRequest())
    expect(promise).rejects.toThrow()
  })
  it('Should call addAccountRepository with correct values', async () => {
    const { sut, AddAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(AddAccountRepositoryStub, 'add')
    const request = makeFakeRequest()
    await sut.add(request)
    expect(addSpy).toHaveBeenCalledWith({
      email: request.email,
      name: request.name,
      password: 'hash_value'
    })
  })
  it('Should throw if addAccountRepository throws', async () => {
    const { sut, AddAccountRepositoryStub } = makeSut()
    jest.spyOn(AddAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add(makeFakeRequest())
    expect(promise).rejects.toThrow()
  })
  it('Should return an account on succeed', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeRequest())
    expect(account).toEqual({
      email: 'any_mail@mail.com',
      id: 'any_id',
      name: 'any_name',
      password: 'hash_password'
    })
  })
})