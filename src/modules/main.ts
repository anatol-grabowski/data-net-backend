import { MongodbModule } from './mongodb'
import { UserModule } from './user'
import { ConfigModule } from './config'
import { Module } from '../di/di'

export const MainModule: Module = {
  name: 'main',
  providers: {
    '_mongodbSvc': null,
    'userRepo': null,
    'config': null,
  },
  submodules: [
    {
      ...ConfigModule,
      exports: {
        'config': 'config',
      }
    },
    {
      ...MongodbModule,
      imports: {
        'mongodb-config': 'config',
      },
      exports: {
        '_mongodbSvc': 'mongodbSvc',
      },
    },
    {
      ...UserModule,
      imports: {
        'mongodbSvc': '_mongodbSvc',
      },
      exports: {
        'userRepo': 'UserRepository',
      },
    },
  ],
}
