import {httpResponse, httpRequest } from '../protocols/http'
import {MissingParamError} from '../errors/missing-param-error'

export class LoginController {
  handle (httpRequest: any): any {
    if (!httpRequest.body.username){
      return {
        statusCode: 400,
        body: new MissingParamError('username')
      }
    } 
    if (!httpRequest.statusCode){
      return {
        statusCode: 400,
        body: new MissingParamError('username')
      }
    } 
  }
}