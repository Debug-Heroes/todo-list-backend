/* eslint-disable @typescript-eslint/no-unused-vars */
import { IEncrypter } from '../../protocols/encrypter'
import { IAddAccountRepository } from '../../protocols/add-account-repository'
import { IAddAccountModel } from '../../../domain/usecases/users/add-account'
import { IAccount } from '../../../domain/protocols/account'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: IEncrypter
  AddAccountRepositoryStub: IAddAccountRepository
}

const makeSut = (): SutTypes => {
  const AddAccountRepositoryStub = makeAddAccountRepositoryStub()
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub, AddAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    AddAccountRepositoryStub
  }
}

const makeEncrypterStub = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    encrypt(value: string): Promise<string> {
      return Promise.resolve('hash_value')
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepositoryStub = (): IAddAccountRepository   => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    add(account: IAddAccountModel): Promise<IAccount> {
      return Promise.resolve({
        email: 'any_mail@mail.com',
        id: 'any_id',
        name: 'any_name',
        password: 'any_password'
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
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const request = makeFakeRequest()
    await sut.add(request)
    expect(encryptSpy).toHaveBeenCalledWith(request.password)
  })
  it('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add(makeFakeRequest())
    expect(promise).rejects.toThrow()
  })
})

// criptografar a senha >> usecase << bcrypt
// enviar para o repositório >> usecase << postgres repository