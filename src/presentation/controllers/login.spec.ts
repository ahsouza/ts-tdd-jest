import { LoginController } from './login'
import { MissingParamError } from '../errors/missing-param-error'

describe('Login Controller', ()=> {

  test('Should return 400 case no username is provided', ()=>{
    const sut = new LoginController()
    const httpRequest = {
      body: {
        username: 'seuusername',
        password: 'suasenha',
        password_confirmation: 'repetirsenha'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('username'))
  })

})