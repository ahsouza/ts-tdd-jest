import { LoginController } from './login'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { ServerError } from '../errors/server-error'
import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/use-cases/add-account'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        username: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new LoginController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no username is provided', () => {
    const { sut } = makeSut()
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
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'seu_username',
        email: 'seu@email.com.br',
        password_confirmation: 'repetirsenha'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'seu_username',
        email: 'seu@email.com.br',
        password: 'suasenha'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password_confirmation'))
  })
  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
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
    const { sut, emailValidatorStub } = makeSut()
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
  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        username: 'seu_username',
        email: 'seu@email.com.br',
        password: 'suasenha',
        password_confirmation: 'suasenha'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      username: 'seu_username',
      email: 'seu@email.com.br',
      password: 'suasenha'
    })
  })
  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
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
  test('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() =>{
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
  test('Should return 200 if valid data is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'valid_username',
        email: 'valid@email.com.br',
        password: 'valid_senha',
        password_confirmation: 'valid_senha'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      username: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
  })
})
