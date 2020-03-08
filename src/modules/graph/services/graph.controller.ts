import * as asyncHandler from 'express-async-handler'
import * as express from 'express'

export class GraphController {
  router?: express.Router

  constructor(
    private readonly mongo,
  ) {
    this.createRouter()
  }

  private createRouter() {
    const router = express.Router()

    router.get('/:name', asyncHandler(async (req, res) => {
      const name = decodeURIComponent(req.params.name)
      const jsonGraph = await this.loadGraph(name)
      res.json({graph: jsonGraph})
    }))

    router.post('/:name', asyncHandler(async (req, res) => {
      const name = decodeURIComponent(req.params.name)
      await this.saveGraph(name, req.body.graph)
      res.json({saved: true})
    }))

    const parentRouter = express.Router()
    parentRouter.use('/graph', router)
    this.router = parentRouter
  }

  private async loadGraph(name) {
    const query = {name}
    const doc = await this.mongo.db.collection('graphs').findOne(query)
    if (!doc) return {nodes: [], edges: []}
    return doc.graph
  }

  private async saveGraph(name, graph) {
    const query = {name}
    const doc = {
      name,
      graph,
    }
    await this.mongo.db.collection('graphs').replaceOne(query, doc, {upsert: true})
  }
}
