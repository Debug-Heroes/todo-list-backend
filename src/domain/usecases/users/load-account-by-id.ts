import { IAccount } from "../../protocols/account";

export interface ILoadAccountById {
  loadById(id: string): Promise<IAccount | null>
}