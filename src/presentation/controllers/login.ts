import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class LoginController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const fields = ['username', 'password', 'password_confirmation']
    for (const field of fields){
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
