import { LoginController } from './login'
import { MissingParamError } from '../errors/missing-param-error'

const makeLogin = (): LoginController => {
  return new LoginController()
}

describe('Login Controller', () => {
  test('Should return 400 case no username is provided', () => {
    const sut = makeLogin()
    const httpRequest = {
      body: {
        password: 'suasenha',
        password_confirmation: 'repetirsenha'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('username'))
  })
})
