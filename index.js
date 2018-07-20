const { mongo } = require('./db/mongo')
const { server } = require('./api/server')

async function init() {
  const serverPort = process.env.PORT || 8080
  const mongodbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/graphs"

  await mongo.connect(mongodbUrl)
  console.log(`connected to mongo at ${mongodbUrl}`)
  await server.listen(serverPort)
  console.log(`started server at ${serverPort}`)
}

init()
.catch(err => {
  console.log(err)
  process.exit(1)
})