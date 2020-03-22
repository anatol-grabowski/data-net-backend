import { config } from './services/config.service'
import { Module } from 'perfect-di'

export const ConfigModule: Module = {
  providers: {
    'config': {
      doExport: true,
      init: () => config,
    },
  },
}
