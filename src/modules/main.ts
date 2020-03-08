import { Module } from '../di/di'

import { UserModule } from './user'
import { ConfigModule } from './config'
import { ApiModule } from './api'
import { GraphModule } from './graph'
import { UploadModule } from './upload'

export const MainModule: Module = {
  name: 'Main',
  providers: {
    'userRepo': null,
    'config': null,
    'apiService': null,
    'routers': {
      dependencies: ['graphCtl', 'uploadCtl'],
      create: (graphCtl, uploadCtl) => [
        graphCtl.router,
        uploadCtl.router,
      ],
    },
    'graphCtl': null,
    'uploadCtl': null,
  },
  submodules: [
    ConfigModule,
    ApiModule,
    GraphModule,
    UploadModule,
    UserModule,
  ],
}
