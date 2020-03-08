import { config } from './services/config.service'

export const ConfigModule = {
  name: 'config',
  providers: {
    'config': {
      create: () => config,
    },
  },
}
