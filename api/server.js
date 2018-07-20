const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const { mongo } = require('../db/mongo')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/graph', (req, res) => {
  console.log('get')
  const jsonGraph = loadGraphFromFile()
  console.log(jsonGraph)
  res.json({graph: jsonGraph})
})

app.post('/graph', (req, res) => {
  console.log('post', req.body)
  const jsonGraph = saveGraphToFile(req.body.graph)
  res.json({saved: true})
})

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

function loadGraphFromMongo() {

}

function saveGraphToMongo(graph) {
  const json = mongo.db.findOne()
}

const server = {
  app,
  listen(port) {
    return new Promise((resolve, reject) => {
      app.listen(port, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}
exports.server = server