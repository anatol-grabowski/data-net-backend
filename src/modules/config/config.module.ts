import { config } from './services/config.service'
import { Module } from '../../di'

export const ConfigModule: Module = {
  providers: {
    'config': {
      doExport: true,
      create: () => config,
    },
  },
}
