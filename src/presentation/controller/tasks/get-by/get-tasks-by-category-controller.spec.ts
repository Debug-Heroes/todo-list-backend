import { HttpRequest } from "@presentation/protocols/http"
import { IValidation } from "@presentation/protocols/validation"
import { GetTasksBycCategoryController } from "./get-tasks-by-category-controller"

const makeFakeRequest = (): HttpRequest => ({
  body: {
    categoryId: 'any_id'
  }
})

interface SutTypes {
  sut: GetTasksBycCategoryController
  validationStub: IValidation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new GetTasksBycCategoryController(validationStub)
  return {
    sut,
    validationStub
  }
}

const makeValidationStub = () => {
  class ValidationStub implements IValidation {
    validate(data: any): Error | null {
      return null  
    }
  }
  return new ValidationStub()
}

describe('GetTasksBycCategoryController', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().query)
  })
})