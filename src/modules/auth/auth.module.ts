import { Module } from 'perfect-di'
import { PasswordService } from './services/password.service'

export const AuthModule: Module = {
  providers: {
    'config': { importFrom: null },
    'passwordSvc': {
      init: () => new PasswordService(),
    },
  },
}
