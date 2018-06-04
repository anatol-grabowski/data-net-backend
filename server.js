const express = require('express')
const fs = require('fs')

const app = express()
const port = 8080
app.listen(port, () => {
  console.log(`listening at ${port}`)
})

app.get('/graph', (req, res) => {
  const jsonGraph = loadGraph()
  res.json(jsonGraph)
})

app.post('/graph', (req, res) => {
  const jsonGraph = saveGraph(req.graph)
  res.end({saved: true})
})

const filename = 'graph.json'
function loadGraph() {
  try {
    const fileContent = fs.readFileSync(filename).toString()
    const jsonGraph = JSON.parse(fileContent)
    return jsonGraph
  } catch (err) {
    return []
  }
}

function saveGraph(graph) {
  const graphString = JSON.stringify(graph)
  fs.writeFileSync(filename, graphString)
}