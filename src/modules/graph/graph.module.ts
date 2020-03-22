import { GraphController } from './services/graph.controller'
import { MongodbModule } from '../mongodb'
import { Module } from '../../di'

export const GraphModule: Module = {
  providers: {
    'config': {
      importFrom: null,
    },
    'mongodbSvc': {
      importFrom: 'Mongodb',
    },
    'graphCtl': {
      doExport: true,
      dependencies: ['mongodbSvc'],
      create: (mongodbSvc) => new GraphController(mongodbSvc),
    },
  },
  submodules: {
    'Mongodb': {
      module: MongodbModule,
    },
  },
}
