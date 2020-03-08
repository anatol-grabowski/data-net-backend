import { PasswordServiceInterface } from '../interfaces/password.service.interface'

export class AuthService {
  constructor(
    private readonly passwordSwc: PasswordServiceInterface,
  ) {}
}
