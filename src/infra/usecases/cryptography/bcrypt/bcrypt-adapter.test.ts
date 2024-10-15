import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}
jest.mock('bcrypt', () => ({
  hash () {
    return 'hash_value'
  }
}))

describe('BcryptAdapter', () => {
  it('Should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  it('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.hash('any_value')
    expect(promise).rejects.toThrow()
  })
  it('Should return a hash on bcrypt succeed', async () => {
    const sut = makeSut()
    const result = await sut.hash('any_value')
    expect(result).toBe('hash_value')
  })
})