/* eslint-disable @typescript-eslint/no-unused-vars */
import { forbidden, ok, serverError } from '../helpers/http-helper'
import { HttpRequest } from '../protocols/http'
import { IDecrypter } from '../../domain/usecases/cryptography/decrypter'
import { AuthMiddleware } from './auth-middleware'

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    authorization: 'Bearer token'
  }
})

interface SutTypes {
  sut: AuthMiddleware
  decrypterStub: IDecrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new AuthMiddleware(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}

const makeDecrypterStub = () => {
  class DecrypterStub implements IDecrypter {
    async decrypt(encryptedValue: string): Promise<string | null> {
      return Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

describe('AuthMiddleware', () => {
  it('Should return 403 if headers have not authorization', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({})
    expect(result).toEqual(forbidden())
  })
  it('Should call decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.handle(makeFakeRequest())
    expect(decryptSpy).toHaveBeenCalledWith('Bearer token')
  })
  it('Should return 500 if decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(serverError())
  })
  it('Should return access denied if decrypter fails', async () => {
    const { sut, decrypterStub } = makeSut()
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(forbidden())
  })
  it('Should return the user id on decrypter succeed', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeFakeRequest())
    expect(result).toEqual(ok({ id: 'any_value' }))
  })
})
