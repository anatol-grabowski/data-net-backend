import { UserRepository } from './services/user.repository'

export const UserModule = {
  name: 'user',
  providers: {
    'mongodbSvc': null,
    'UserRepository': {
      dependencies: [
        'mongodbSvc',
      ],
      create: (mongodbSvc) => new UserRepository(mongodbSvc.db),
    },
  },
}
