 
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IValidation } from "../../domain/usecases/users/validation"
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
  it('Should return the first error if more than one validation fails', () => {
    const { sut, validators } = makeSut()
    jest.spyOn(validators[0], 'validate').mockReturnValueOnce(new Error('first_error'))
    jest.spyOn(validators[1], 'validate').mockReturnValueOnce(new Error('second_error'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error('first_error'))
  })
  it('Should throw if any validation throws', () => {
    const { sut, validators } = makeSut()
    jest.spyOn(validators[0], 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})