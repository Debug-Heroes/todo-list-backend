import { IAccount } from '../../../../../domain/protocols/account'
import { IUpdatedAccount, UpdateAccountModel } from '../../../../../domain/usecases/users/update-account'
import { IUpdateAccountRepository } from '../../../../protocols/db/update-account-repository'
import { DbUpdateAccount } from './update-account'

interface SutTypes {
  sut: DbUpdateAccount
  updateAccountRepositoryStub: IUpdateAccountRepository
}

const makeSut = (): SutTypes => {
  const updateAccountRepositoryStub = makeUpdateAccountRepositoryStub()
  const sut = new DbUpdateAccount(updateAccountRepositoryStub)
  return {
    sut,
    updateAccountRepositoryStub
  }
}

const makeUpdateAccountRepositoryStub = (): IUpdateAccountRepository => {
  class UpdateAccountRepStub implements IUpdateAccountRepository {
    async update(account: UpdateAccountModel): Promise<IAccount> {
      return Promise.resolve({
        email: 'any_mail@mail.com',
        id: 'any_id',
        name: 'any_name',
        password: 'any_hash'
      })
    }
  }
  return new UpdateAccountRepStub()
}

const makeFakeRequest = (): UpdateAccountModel => ({
  id: 'any_id',
  email: 'any_mail@mail.com'
})

describe('DbUpdateAccount', () => {
  it('Should call repository with correct values', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccountRepositoryStub, 'update')
    await sut.update(makeFakeRequest())
    expect(updateSpy).toHaveBeenCalledWith(makeFakeRequest())
  })
  it('Should throw if repository throws', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    jest.spyOn(updateAccountRepositoryStub, 'update').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.update(makeFakeRequest())
    expect(promise).rejects.toThrow()
  })
})