export class ForbiddenError extends Error {
  constructor() {
    super(`Not Authorized.`);
    this.name = 'Forbidden' 
  }
}