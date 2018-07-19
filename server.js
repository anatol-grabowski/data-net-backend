const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`listening at ${port}`)
})

app.get('/graph', (req, res) => {
  console.log('get')
  const jsonGraph = loadGraph()
  console.log(jsonGraph)
  res.json({graph: jsonGraph})
})

app.post('/graph', (req, res) => {
  console.log('post', req.body)
  const jsonGraph = saveGraph(req.body.graph)
  res.json({saved: true})
})

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