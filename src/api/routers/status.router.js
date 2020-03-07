const express = require('express')
const asyncHandler = require('express-async-handler')

const router = express.Router()

router.get('/', asyncHandler(async (request, response) => {
  const { mongo } = require('../../db/mongo')
  const { server } = require('../server')
  const { dropbox } = require('../../storage/dropbox')

  const health = {
    mongodb: {
      graphs: await listGraphs(mongo),
    },
    httpServer: {
      port: server.port,
    },
    dropbox: {
      rootDirectory: await dropbox.test(),
      spaceUsage: await dropbox.dbx.usersGetSpaceUsage(),
    }
  }
  response.json(health)
}))

async function listGraphs(mongo) {
  const graphs = await mongo.db.collection('graphs').find({}).toArray()
  return graphs.map(gr => gr.name)
}

exports.statusRouter = router