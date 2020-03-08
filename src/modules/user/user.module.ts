import { UserRepository } from './services/user.repository'
import { MongodbModule } from '../mongodb'

export const UserModule = {
  name: 'User',
  providers: {
    'config': null,
    'mongodbSvc': null,
    'userRepo': {
      dependencies: [
        'mongodbSvc',
      ],
      create: (mongodbSvc) => new UserRepository(mongodbSvc.db),
    },
  },
  submodules: [
    MongodbModule,
  ],
  imports: {
    'config': 'config',
  },
  exports: {
    'userRepo': 'userRepo',
  },
}
