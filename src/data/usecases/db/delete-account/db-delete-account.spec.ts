import { DbDeleteAccount } from './db-delete-account'
import { IDeleteAccountRepository } from '../../../protocols/db/delete-account-repository'

interface SutTypes {
  sut: DbDeleteAccount
  deleteAccountRepositoryStub: IDeleteAccountRepository
}

const makeSut = (): SutTypes => {
  const deleteAccountRepositoryStub = makeDeleteAccountRepositoryStub()
  const sut = new DbDeleteAccount(deleteAccountRepositoryStub)
  return {
    sut,
    deleteAccountRepositoryStub
  }
}

const makeDeleteAccountRepositoryStub = (): IDeleteAccountRepository => {
  class DeleteAccountRepositoryStub implements IDeleteAccountRepository {
    delete(id: string): Promise<string> {
      return Promise.resolve('affected rows 1')
    }
  }
  return new DeleteAccountRepositoryStub()
}

describe('DbDeleteAccount', () => {
  it('Should call repository with correct value', async () => {
    const { sut, deleteAccountRepositoryStub } = makeSut() 
    const deleteSpy = jest.spyOn(deleteAccountRepositoryStub, 'delete')
    await sut.delete('any_id')
    expect(deleteSpy).toHaveBeenCalledWith('any_id')
  })
  it('Should throw if repository throws', async () => {
    const { sut, deleteAccountRepositoryStub } = makeSut() 
    jest.spyOn(deleteAccountRepositoryStub, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = sut.delete('any_id')
    expect(response).rejects.toThrow()
  })
  it('Should return affected rows on repository succeed', async () => {
    const { sut } = makeSut()
    const response = await sut.delete('any_id')
    expect(response).toEqual('affected rows 1')
  })
})