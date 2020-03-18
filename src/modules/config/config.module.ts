import { config } from './services/config.service'
import { Module } from '../../di'

export const ConfigModule: Module = {
  name: 'Config',
  providers: {
    'config': {
      doExport: true,
      create: () => config,
    },
  },
}
