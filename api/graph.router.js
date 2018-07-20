const fs = require('fs')
const { mongo } = require('../db/mongo')
const express = require('express')

const router = express.Router()

const asyncExpress = fn => (req, res, next) => {
  return Promise.resolve(fn(req, res, next))
  .catch(next);
};

router.get('/', asyncExpress(async (req, res) => {
  console.log('get')
  const jsonGraph = await loadGraphFromMongo()
  console.log(jsonGraph)
  res.json({graph: jsonGraph})
}))

router.post('/', asyncExpress(async (req, res) => {
  console.log('post', req.body)
  const jsonGraph = await saveGraphToMongo(req.body.graph)
  res.json({saved: true})
}))

const filename = 'graph.json'
function loadGraphFromFile() {
  try {
    const fileContent = fs.readFileSync(filename).toString()
    const jsonGraph = JSON.parse(fileContent)
    return jsonGraph
  } catch (err) {
    return {nodes: [], edges: []}
  }
}

function saveGraphToFile(graph) {
  const graphString = JSON.stringify(graph)
  fs.writeFileSync(filename, graphString)
}

async function loadGraphFromMongo() {
  const query = {_id: filename}
  const json = await mongo.db.collection('graphs').findOne(query)
  if (!json) return {nodes: [], edges: []}
  return json
}

async function saveGraphToMongo(graph) {
  const query = {_id: filename}
  const json = await mongo.db.collection('graphs').replaceOne(query, graph, {upsert: true})
}

exports.graphRouter = router