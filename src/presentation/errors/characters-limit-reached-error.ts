export class CharactersLimitReached extends Error {
  constructor() {
    super(`characters limit reached.`)
    this.name = 'CharactersLimitReached'
  }
}
