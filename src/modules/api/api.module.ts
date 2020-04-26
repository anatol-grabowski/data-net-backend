import { ServerService } from './services/server.service'
import { Module } from 'perfect-di'

export const ApiModule: Module = {
  providers: {
    'routers': { importFrom: null },
    'config': { importFrom: null },
    'apiService': {
      doExport: true,
      dependencies: ['config', 'routers'],
      init: async (config, routers) => {
        const api = new ServerService()
        await api.listen(config, routers)
        return api
      },
    },
  },
}
