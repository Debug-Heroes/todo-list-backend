/* eslint-disable @typescript-eslint/no-unused-vars */
import { IAccount } from "../../../../domain/protocols/account"
import { IAuthentication, IAuthenticationModel } from "../../../../domain/usecases/users/authentication"
import { ILoadAccountByEmail } from "../../../../domain/usecases/users/load-account"
import { DbAuthentication } from './db-authenticate'
import { IComparer } from '../../../protocols/criptography/comparer'
import { IEncrypter } from "../../../protocols/criptography/encrypter"

interface SutTypes {
  sut: IAuthentication
  loadByEmailStub: ILoadAccountByEmail
  comparerStub: IComparer
  encrypterStub: IEncrypter
}

const makeSut = (): SutTypes => {
  const loadByEmailStub = makeLoadByEmail()
  const comparerStub = makeComparerStub()
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAuthentication(loadByEmailStub, comparerStub, encrypterStub)
  return {
    sut,
    loadByEmailStub,
    comparerStub,
    encrypterStub
  }
}

const makeEncrypterStub = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(anyValue: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new EncrypterStub()
}

const makeComparerStub = (): IComparer => {
  class ComparerStub implements IComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new ComparerStub()
}

const makeLoadByEmail = (): ILoadAccountByEmail => {
  class LoadAccByEmail implements ILoadAccountByEmail {
    async load(email: string): Promise<IAccount | null> {
      return Promise.resolve({
        email: 'any_mail@mail.com',
        id: 'any_id',
        name: 'any_name',
        password: 'any_hash'
      })
    }
  }
  return new LoadAccByEmail()
}

const makeFakeRequest = (): IAuthenticationModel => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})

describe('DbAuthenticate', () => {
  it('Should call LoadByEmail with correct value', async () => {
    const { sut, loadByEmailStub } = makeSut()
    const loadSpy = jest.spyOn(loadByEmailStub, 'load')
    await sut.auth(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
  it('Should not return if LoadByEmail return null', async () => {
    const { sut, loadByEmailStub } = makeSut()
    jest.spyOn(loadByEmailStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.auth(makeFakeRequest())
    expect(result).toBeFalsy()
  })
  it('Should throw if LoadByEmail throws', async () => {
    const { sut, loadByEmailStub } = makeSut()
    jest.spyOn(loadByEmailStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth(makeFakeRequest())
    expect(promise).rejects.toThrow()
  })
  it('Should call comparer with correct values', async () => {
    const { sut, comparerStub } = makeSut()
    const compareSpy = jest.spyOn(comparerStub, 'compare')
    await sut.auth(makeFakeRequest())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_hash')
  })
  it('Should not return if comparer fails', async () => {
    const { sut, comparerStub } = makeSut()
    jest.spyOn(comparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const result = await sut.auth(makeFakeRequest())
    expect(result).toBeFalsy()
  })
  it('Should throw if comparer throws', async () => {
    const { sut, comparerStub } = makeSut()
    jest.spyOn(comparerStub, 'compare').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth(makeFakeRequest())
    expect(promise).rejects.toThrow()
  })
  it('Should call encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeRequest())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })
  it('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth(makeFakeRequest())
    expect(promise).rejects.toThrow()
  })
  it('Should return an token on succeed', async () => {
    const { sut } = makeSut()
    const token = await sut.auth(makeFakeRequest())
    expect(token).toEqual('any_token')
  })
})