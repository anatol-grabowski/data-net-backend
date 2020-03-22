import { MongodbService } from './services/connection.service'
import { Module } from 'perfect-di'

export const MongodbModule: Module = {
  providers: {
    'config': {
      importFrom: null,
    },
    'mongodbSvc': {
      doExport: true,
      dependencies: ['config'],
      init: async (config) => {
        const mongoSvc = new MongodbService()
        await mongoSvc.connect(config.mongodbUrl)
        return mongoSvc
      },
    },
  },
}
