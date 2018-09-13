const express = require('express')

const router = express.Router()

router.get('/', (request, response) => {
  const { mongo } = require('../../db/mongo')
  const { server } = require('../server')
  const health = {
    mongodbRunning: Boolean(mongo.client),
    serverPort: server.port,
  }
  response.json(health)
})

exports.statusRouter = router