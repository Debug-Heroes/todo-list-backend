import { HttpRequest } from "@presentation/protocols/http"
import { IValidation } from "@presentation/protocols/validation"
import { CreateTaskController } from "./create-task-controller"

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    text: 'any_text',
    userId: 'any_user'
  }
})

interface SutTypes {
  sut: CreateTaskController
  validationStub: IValidation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new CreateTaskController(validationStub)
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

describe('CreateTaskController', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })
})