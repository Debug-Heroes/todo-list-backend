/* eslint-disable @typescript-eslint/no-unused-vars */
import { forbidden } from '../helpers/http-helper'
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
    async decrypt(encryptedValue: string): Promise<string> {
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
})
