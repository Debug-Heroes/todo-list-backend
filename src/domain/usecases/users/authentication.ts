export interface IAuthentication {
  auth(account: IAuthenticationModel): Promise<string | null>
}

export interface IAuthenticationModel {
  email: string
  password: string
}
