import { PasswordService } from './password.service'

describe('PasswordService', () => {
  let pswSvc

  beforeEach(() => {
    pswSvc = new PasswordService()
  })

  it('should compare password with its hash', async () => {
    const correctPsw = 'password'
    const incorrectPsw = 'password2'
    const hashed = await pswSvc.hash(correctPsw)

    const isCorrectOk = await pswSvc.compare(correctPsw, hashed)
    const isIncorrectOk = await pswSvc.compare(incorrectPsw, hashed)
    expect(hashed).not.toBe(correctPsw)
    expect(isCorrectOk).toBeTruthy()
    expect(isIncorrectOk).toBeFalsy()
  })
})
