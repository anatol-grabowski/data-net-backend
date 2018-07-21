const { mongo } = require('./db/mongo')
const { server } = require('./api/server')

async function start() {
  console.log('starting')
  const serverPort = process.env.PORT || 8080
  const mongodbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/graphs"

  await mongo.connect(mongodbUrl)
  console.log(`connected to mongo at ${mongodbUrl}`)
  await server.listen(serverPort)
  console.log(`started server at ${serverPort}`)
}

start()
.catch(err => {
  console.log(err)
  process.exit(1)
})