import { MongodbService } from './services/connection.service'

export const MongodbModule = {
  name: 'mongodb',
  imports: [
    'connectionUrl',
  ],
  providers: {
    'mongodb-config': null,
    'mongodbSvc': {
      dependencies: [
        'mongodb-config',
      ],
      create: async (config) => {
        const mongoSvc = new MongodbService()
        await mongoSvc.connect(config.mongodbUrl)
        return mongoSvc
      },
    },
  },
  exports: [
    'mongodbSvc',
  ],
}
