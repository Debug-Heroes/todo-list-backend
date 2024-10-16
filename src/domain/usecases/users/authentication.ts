import { IAccount } from "../../protocols/account"

export interface IAuthentication {
  auth (account: IAuthenticationModel): Promise<IAccount | null>
}

export interface IAuthenticationModel {
  email: string
  password: string
}