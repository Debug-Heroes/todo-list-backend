export interface IDeleteAccountRepository {
  delete(id: string): Promise<string>
}