/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IValidation } from "../../domain/protocols/validation"
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validators: IValidation[]
}

const makeSut = (): SutTypes => {
  const validators: IValidation[] = [
    makeValidationStub(),
    makeValidationStub()
  ]
  const sut = new ValidationComposite(validators)
  return {
    sut,
    validators 
  }
}

const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(data: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

describe('ValidationComposite', () => {
  it('Should call validation with correct values', () => {
    const { sut, validators } = makeSut()
    const validateSpy = jest.spyOn(validators[0], 'validate')
    sut.validate({ field: 'any_value' })
    expect(validateSpy).toHaveBeenCalledWith({ field: 'any_value' })
  })
})