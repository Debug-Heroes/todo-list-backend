import { MissingParamError } from "../errors/missing-param-error";
import { IValidation } from "../protocols/validation";

export class RequiredAtLeastOneIn implements IValidation {
  constructor(private readonly fields: string[]) {}
  validate(data: any): Error | null {
    let count = this.fields.length
    for (const pos of this.fields) {
      if (!data[pos]) {
        count--
      }
    }
    if (count === 0) {
      return new MissingParamError('to change')
    }
    return null
  }
}