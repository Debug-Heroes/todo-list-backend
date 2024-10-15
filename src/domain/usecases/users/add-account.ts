import { IAccount } from "../../protocols/account"

export interface IAddAccount {
  add (account: IAddAccountModel): Promise<IAccount>
}

export interface IAddAccountModel {
  name: string
  email: string
  password: string
}