import { config } from './services/config.service'

export const ConfigModule = {
  name: 'Config',
  providers: {
    'config': {
      create: () => config,
    },
  },
  exports: {
    'config': 'config',
  },
}
