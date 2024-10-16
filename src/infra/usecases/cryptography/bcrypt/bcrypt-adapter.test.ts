import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}
jest.mock('bcrypt', () => ({
  hash() {
    return 'hash_value'
  },
  compare() {
    return true
  }
}))

describe('BcryptAdapter', () => {
  describe('hash', () => {
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
  describe('compare', () => {
    it('Should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })
    it('Should throw if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.compare('any_value', 'any_hash')
      expect(promise).rejects.toThrow()
    })
    it('Should return false if compare returns false', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(false))
      })
      const result = await sut.compare('any_value', 'any_hash')
      expect(result).toBeFalsy()
    })
    it('Should return true if compare returns true', async () => {
      const sut = makeSut()
      const result = await sut.compare('any_value', 'any_hash')
      expect(result).toBeTruthy()
    })
  })
})
