import { LoginController } from './login'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeLogin = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new LoginController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 case no username is provided', () => {
    const { sut } = makeLogin()
    const httpRequest = {
      body: {
        email: 'seu@email.com.br',
        password: 'suasenha',
        password_confirmation: 'repetirsenha'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('username'))
  })

  test('Should return 400 case no email is provided', () => {
    const { sut, emailValidatorStub } = makeLogin()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        username: 'seu_username',
        email: 'seu@email.com.br',
        password: 'suasenha',
        password_confirmation: 'repetirsenha'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})
