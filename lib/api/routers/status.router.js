const express = require('express')

const router = express.Router()

router.get('/', (request, response) => {
  const { mongo } = require('../db/mongo')
  const { server } = require('./server')
  const health = {
    mongodbUrl: mongo.url,
    serverPort: server.port,
  }
  response.json(health)
})

exports.statusRouter = router