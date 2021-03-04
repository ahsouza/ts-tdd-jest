import {httpResponse, httpRequest } from '../protocols/http'

export class LoginController {
  handle (httpRequest: any): any {
    if (!httpRequest.body.username){
      return {
        statusCode: 400,
        body: new Error('Missing param: username')
      }
    } 
    if (!httpRequest.statusCode){
      return {
        statusCode: 400,
        body: new Error('Missing param: username')
      }
    } 
  }
}