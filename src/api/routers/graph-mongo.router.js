const { mongo } = require('../../db/mongo')
const asyncHandler = require('express-async-handler')
const express = require('express')

const router = express.Router()


router.get('/:name', asyncHandler(async (req, res) => {
  const name = decodeURIComponent(req.params.name)
  const jsonGraph = await loadGraph(name)
  res.json({graph: jsonGraph})
}))

router.post('/:name', asyncHandler(async (req, res) => {
  const name = decodeURIComponent(req.params.name)
  await saveGraph(name, req.body.graph)
  res.json({saved: true})
}))

async function loadGraph(name) {
  const query = {name}
  const doc = await mongo.db.collection('graphs').findOne(query)
  if (!doc) return {nodes: [], edges: []}
  return doc.graph
}

async function saveGraph(name, graph) {
  const query = {name}
  const doc = {
    name,
    graph,
  }
  await mongo.db.collection('graphs').replaceOne(query, doc, {upsert: true})
}

exports.graphRouter = router