export interface IUpdateAccount {
  update(values: UpdateAccountModel): Promise<IUpdatedAccount>
}

export interface IUpdatedAccount {
  id: string
  name: string
  email: string
}

export interface UpdateAccountModel {
  id: string
  name?: string
  email?: string
}