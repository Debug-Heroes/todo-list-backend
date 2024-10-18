export interface IDeleteAccount {
  delete(id: string): Promise<string>
}