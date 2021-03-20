import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'
import { AddAccount } from '../../domain/use-cases/add-account'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount){
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try{
      const fields = ['username', 'email', 'password', 'password_confirmation']
      for (const field of fields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { username, email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = this.addAccount.add({
        username,
        email,
        password
      })
      return {
        statusCode: 200,
        body: account
      }
    }catch (e){
      return serverError()
    }
  }
}
