import { isEmail } from 'validator'
import { IEmailValidator } from '../../presentation/protocols/email-validator'

export class EmailValidator implements IEmailValidator {
  isValid(email: string): boolean {
    return isEmail(email)
  }
}
