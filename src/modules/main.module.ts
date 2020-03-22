import { Module } from 'perfect-di'

import { UserModule } from './user'
import { ConfigModule } from './config'
import { ApiModule } from './api'
import { GraphModule } from './graph'
import { UploadModule } from './upload'

export const MainModule: Module = {
  providers: {
    'userRepo': { importFrom: 'User' },
    'config': { importFrom: 'Config' },
    'apiService': { importFrom: 'Api' },
    'routers': {
      dependencies: ['graphCtl', 'uploadCtl'],
      init: (graphCtl, uploadCtl) => [
        graphCtl.router,
        uploadCtl.router,
      ],
    },
    'graphCtl': { importFrom: 'Graph' },
    'uploadCtl': { importFrom: 'Upload' },
  },
  submodules: {
    'Config': { module: ConfigModule },
    'Api': { module: ApiModule },
    'Graph': { module: GraphModule },
    'Upload': { module: UploadModule },
    'User': { module: UserModule },
  },
}
