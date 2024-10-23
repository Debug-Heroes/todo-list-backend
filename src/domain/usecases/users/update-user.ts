import { IAccount } from '../../protocols/account'

export interface IUpdateUser {
  update(values: UpdateUserModel): Promise<IAccount>
}

export interface UpdateUserModel {
  id: string
  name?: string
  email?: string
  password?: string
}