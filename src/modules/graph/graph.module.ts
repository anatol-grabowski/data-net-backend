import { GraphController } from './services/graph.controller'
import { MongodbModule } from '../mongodb'

export const GraphModule = {
  name: 'Graph',
  providers: {
    'config': null,
    'mongodbSvc': null,
    'graphCtl': {
      dependencies: ['mongodbSvc'],
      create: (mongo) => new GraphController(mongo),
    },
  },
  submodules: [
    MongodbModule,
  ],
  imports: {
    'config': 'config',
  },
  exports: {
    'graphCtl': 'graphCtl',
  },
}
