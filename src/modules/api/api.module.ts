import { ApiService } from './services/api.service'
import { Module } from '../../di'

export const ApiModule: Module = {
  providers: {
    'routers': { importFrom: null },
    'config': { importFrom: null },
    'apiService': {
      doExport: true,
      dependencies: ['config', 'routers'],
      create: async (config, routers) => {
        const api = new ApiService(config, routers)
        await api.listen()
        return api
      },
    },
  },
}
