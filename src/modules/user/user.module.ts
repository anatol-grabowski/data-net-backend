import { UserRepository } from './services/user.repository'
import { MongodbModule } from '../mongodb'
import { Module } from 'perfect-di'

export const UserModule: Module = {
  providers: {
    'config': { importFrom: null },
    'mongodbSvc': { importFrom: 'Mongodb' },
    'userRepo': {
      doExport: true,
      dependencies: [
        'mongodbSvc',
      ],
      init: (mongodbSvc) => new UserRepository(mongodbSvc.db),
    },
  },
  submodules: {
    'Mongodb': { module: MongodbModule },
  },
}
