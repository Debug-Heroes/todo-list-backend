/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpRequest } from '../../../protocols/http'
import { IValidation } from '../../../protocols/validation'
import { DeleteUserController } from './delete-user-controller'

interface SutTypes {
  sut: DeleteUserController
  validationStub: IValidation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new DeleteUserController(validationStub)
  return {
    sut,
    validationStub
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

const makeFakeRequest = (): HttpRequest => ({
  body: {
    id: 'any_id'
  }
})

describe('DeleteUserController', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
})