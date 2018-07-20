const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { graphRouter } = require('./graph.router')
const { statusRouter } = require('./status.router')
const { errorHandlerMiddleware } = require('./error-handler.middleware')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/status', statusRouter)
app.use('/graph', graphRouter)

app.use(errorHandlerMiddleware)

const server = {
  app,
  port: null,
  listen(port) {
    this.port = port
    return new Promise((resolve, reject) => {
      app.listen(port, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}
exports.server = server