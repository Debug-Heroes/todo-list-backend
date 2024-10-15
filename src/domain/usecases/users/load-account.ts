import { IAccount } from '../../protocols/account'

export interface ILoadAccountByEmail {
  load(email: string): Promise<IAccount | null>
}
