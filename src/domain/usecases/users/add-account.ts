import { IAccount } from "../../protocols/account"

export interface IAddAccount {
  add (account: AddAccountModel): Promise<IAccount>
}

export interface IAddAccountModel {
  name: string
  email: string
  password: string
}