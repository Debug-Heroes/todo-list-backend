import { IAccount } from "../../protocols/account"

export interface IAuthentication {
  auth (account: IAuthenticationModel): Promise<IAccount>
}

export interface IAuthenticationModel {
  email: string
  password: string
}