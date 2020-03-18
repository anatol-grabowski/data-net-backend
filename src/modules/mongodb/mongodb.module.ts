import { MongodbService } from './services/connection.service'
import { Module } from '../../di'

export const MongodbModule: Module = {
  name: 'Mongodb',
  providers: {
    'config': {
      importFrom: null,
    },
    'mongodbSvc': {
      doExport: true,
      dependencies: ['config'],
      create: async (config) => {
        const mongoSvc = new MongodbService()
        await mongoSvc.connect(config.mongodbUrl)
        return mongoSvc
      },
    },
  },
}
