import { LoginController } from './login'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { ServerError } from '../errors/server-error'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeLogin = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
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
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeLogin()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        username: 'seu_username',
        email: 'seu@email.com.br',
        password: 'suasenha',
        password_confirmation: 'repetirsenha'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('seu@email.com.br')
  })
  
  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeLogin()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() =>{
      throw new Error()
    })
    const httpRequest = {
      body: {
        username: 'seu_username',
        email: 'seu@email.com.br',
        password: 'suasenha',
        password_confirmation: 'repetirsenha'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
