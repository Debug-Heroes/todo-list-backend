export class EmailAlreadyExistError extends Error {
  constructor() {
    super('email already exist.')
    this.name = 'EmailAlreadyExistError'
  }
}
