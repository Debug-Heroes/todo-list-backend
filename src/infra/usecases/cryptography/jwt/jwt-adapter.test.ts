import jwt from "jsonwebtoken"
import { JwtAdapter } from './jwt-adapter'

const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter('any_secret')
  return sut
}

jest.mock('jsonwebtoken', () => ({
  sign() {
    return 'any_token'
  },
  verify() {
    return { id: 'any_id' }
  }
}))

describe('JwtAdapter', () => {
  it('Should call verify with correct values', async () => {
    const sut = makeSut()
    const verifySpy = jest.spyOn(jwt, 'verify')
    await sut.decrypt('any_value')
    expect(verifySpy).toHaveBeenCalledWith('any_value', 'any_secret')
  })
  it('Should return null on verify fails', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'verify').mockReturnValueOnce('any_error' as any)
    const result = await sut.decrypt('any_value')
    expect(result).toBeFalsy()
  })
  it('Should return an id on verify succeed', async () => {
    const sut = makeSut()
    const result = await sut.decrypt('any_value')
    expect(result).toBe('any_id')
  })
})