import { IAccount } from "../../protocols/account";

export interface ILoadAccountById {
  load(id: string): Promise<IAccount | null>
}