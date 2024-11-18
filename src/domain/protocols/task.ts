export interface ITask {
  id: string
  name: string
  text: string
  userId: string
  progress: TASK_PROGRESS_TYPES
  created_at: Date
}

export enum TASK_PROGRESS_TYPES {
  NOT_STARTED='Not Started',
  IN_PROGRESS='In Progress',
  COMPLETED='Completed'
}