const fs = require('fs')
const asyncHandler = require('express-async-handler')
const express = require('express')

const router = express.Router()

router.get('/', asyncHandler(async (req, res) => {
  const jsonGraph = await loadGraph()
  res.json({graph: jsonGraph})
}))

router.post('/', asyncHandler(async (req, res) => {
  await saveGraph(req.body.graph)
  res.json({saved: true})
}))

const filename = 'graph.json'
function loadGraph() {
  try {
    const fileContent = fs.readFileSync(filename).toString()
    const jsonGraph = JSON.parse(fileContent)
    return jsonGraph
  } catch (err) {
    return {nodes: [], edges: []}
  }
}

function saveGraph(graph) {
  const graphString = JSON.stringify(graph)
  fs.writeFileSync(filename, graphString)
}

exports.graphRouter = router