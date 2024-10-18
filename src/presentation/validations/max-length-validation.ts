import { IValidation } from '../protocols/validation'
import { CharactersLimitReached } from '../errors/characters-limit-reached-error'

export class MaxLengthValidation implements IValidation {
  constructor(private readonly field: string, private readonly limit: number) {}
  validate(data: any): Error | null {
    if (data[this.field].length > this.limit)
      return new CharactersLimitReached()
    return null
  }
}
