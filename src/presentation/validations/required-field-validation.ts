
import { IValidation } from "../../domain/protocols/validation";
import { MissingParamError } from "../errors/missing-param-error";

export class RequiredFieldValidation implements IValidation {
  constructor(private readonly field: string) {}
  validate(data: any): Error | null {
    if (!data[this.field]) {
      return new MissingParamError(this.field)
    }
    return null
  }
}