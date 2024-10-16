/* eslint-disable @typescript-eslint/no-unused-vars */
import { IAccount } from "../../../../domain/protocols/account"
import { IAuthentication, IAuthenticationModel } from "../../../../domain/usecases/users/authentication"
import { ILoadAccountByEmail } from "../../../../domain/usecases/users/load-account"
import { DbAuthentication } from './db-authenticate'

interface SutTypes {
  sut: IAuthentication
  loadByEmailStub: ILoadAccountByEmail
}

const makeSut = (): SutTypes => {
  const loadByEmailStub = makeLoadByEmail()
  const sut = new DbAuthentication(loadByEmailStub)
  return {
    sut,
    loadByEmailStub
  }
}

const makeLoadByEmail = (): ILoadAccountByEmail => {
  class LoadAccByEmail implements ILoadAccountByEmail {
    async load(email: string): Promise<IAccount | null> {
      return Promise.resolve({
        email: 'any_mail@mail.com',
        id: 'any_id',
        name: 'any_name',
        password: 'any_password'
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
})