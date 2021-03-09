import {httpResponse, httpRequest } from '../protocols/http'
import {MissingParamError} from '../errors/missing-param-error'
import {badRequest} from '../helpers/http-helper'
import {Controller} from '../protocols/controller'

export class LoginController implements Controller{
  handle (HttpRequest: httpRequest): httpResponse {
    const fields = ['username', 'password', 'password_confirmation']
    for (const field of fields) {
      if (!HttpRequest.body[field]){
        return badRequest(new MissingParamError(field))
      }
    }
  }
}