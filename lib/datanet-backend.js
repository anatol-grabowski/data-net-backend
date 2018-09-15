const { mongo } = require('./db/mongo')
const { server } = require('./api/server')
const { dropbox } = require('./storage/dropbox')

async function start() {
  console.log('starting')
  const serverPort = process.env.PORT || 8080
  const mongodbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/graphs'
  const dropboxAccessToken = process.env.DROPBOX_ACCESS_TOKEN

  console.log(`connecting to mongo at ${mongodbUrl}`)
  await mongo.connect(mongodbUrl)
  console.log(`starting http server on port ${serverPort}`)
  await server.listen(serverPort)
  console.log(`using dropbox access token ${dropboxAccessToken}`)
  await dropbox.authenticate(dropboxAccessToken)

  console.log('started')
}

exports.start = start