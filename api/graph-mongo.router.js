const { mongo } = require('../db/mongo')
const { asyncExpress } = require('./async-express')
const express = require('express')

const router = express.Router()


router.get('/', asyncExpress(async (req, res) => {
  const jsonGraph = await loadGraph()
  res.json({graph: jsonGraph})
}))

router.post('/', asyncExpress(async (req, res) => {
  const jsonGraph = await saveGraph(req.body.graph)
  res.json({saved: true})
}))

const id = 'graph.json'
async function loadGraph() {
  const query = {_id: id}
  const json = await mongo.db.collection('graphs').findOne(query)
  if (!json) return {nodes: [], edges: []}
  return json
}

async function saveGraph(graph) {
  const query = {_id: id}
  const json = await mongo.db.collection('graphs').replaceOne(query, graph, {upsert: true})
}

exports.graphRouter = router