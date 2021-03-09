import { LoginController } from './login'
import { MissingParamError } from '../errors/missing-param-error'

const makeLogin = (): LoginController => {
  return new LoginController()
}

describe('Login Controller', () => {
  test('Should return 400 case no username is provided', ()=>{
    const sut = makeLogin()
    const request = {
      body: {
        username: 'seuusername',
        password: 'suasenha',
        password_confirmation: 'repetirsenha'
      }
    }
    const HttpResponse = sut.handle(request)
    expect(HttpResponse.statusCode).toBe(400)
    expect(HttpResponse.body).toEqual(new MissingParamError('username'))
  })

})