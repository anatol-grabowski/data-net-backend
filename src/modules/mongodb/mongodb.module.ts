import { MongodbService } from './services/connection.service'

export const MongodbModule = {
  name: 'Mongodb',
  providers: {
    'config': null,
    'mongodbSvc': {
      dependencies: ['config'],
      create: async (config) => {
        const mongoSvc = new MongodbService()
        await mongoSvc.connect(config.mongodbUrl)
        return mongoSvc
      },
    },
  },
  imports: {
    'config': 'config',
  },
  exports: {
    'mongodbSvc': 'mongodbSvc',
  },
}
