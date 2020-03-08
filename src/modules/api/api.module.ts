import { ApiService } from './services/api.service'

export const ApiModule = {
  name: 'Api',
  providers: {
    'routers': null,
    'config': null,
    'apiService': {
      dependencies: ['config', 'routers'],
      create: async (config, routers) => {
        const api = new ApiService(config, routers)
        await api.listen()
        return api
      },
    },
  },
  imports: {
    'routers': 'routers',
    'config': 'config',
  },
  exports: {
    'apiService': 'apiService',
  },
}
