import * as bcrypt from 'bcrypt'
import { PasswordServiceInterface } from '../interfaces/password.service.interface'

const saltRounds = 12

export class PasswordService implements PasswordServiceInterface {
  async hash(plaintextPsw: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds)
    const hashed = await bcrypt.hash(plaintextPsw, salt)
    return hashed
  }

  async compare(plaintextPsw: string, pswHash: string): Promise<boolean> {
    const doesMatch = await bcrypt.compare(plaintextPsw, pswHash)
    return doesMatch
  }
}
