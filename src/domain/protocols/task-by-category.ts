import { ICategory } from "./category";
import { ITask } from "./task";

export interface TaskByCategory extends ITask {
  categories: ICategory[]
}