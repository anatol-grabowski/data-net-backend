const express = require('express')
const asyncHandler = require('express-async-handler')

const router = express.Router()

router.get('/', asyncHandler(async (request, response) => {
  const { mongo } = require('../../db/mongo')
  const { server } = require('../server')
  const { dropbox } = require('../../storage/dropbox')

  const health = {
    mongodbRunning: Boolean(mongo.client),
    serverPort: server.port,
    dropboxRoot: await dropbox.test(),
  }
  response.json(health)
}))

exports.statusRouter = router