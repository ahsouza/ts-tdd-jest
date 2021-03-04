export class MissingParamError extends Error {
  constructor (paramUsername: string) {
    super(`Missing param: ${paramUsername}`)
    this.name = 'MissingParamError'
  }
}