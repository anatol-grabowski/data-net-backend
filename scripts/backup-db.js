const { URL } = require('url')
const child_process = require('child_process')
const util = require('util')
const exec = util.promisify(child_process.exec)
const path = require('path')

function parseMongodbUri(uri) {
  const url = new URL(uri)

  const parsed = {
    username: url.username,
    password: url.password,
    host: url.host,
    db: url.pathname.substr(1),
  }
  return parsed
}

async function mongoexportCollection(dbUri, collection, filename) {
  const cmd = `mongoexport --uri "${dbUri}" -c ${collection} -o ${filename}`
  console.log(cmd)
  const outs = await exec(cmd)
  console.log(outs)
}

async function backup() {
  const mongodbUri = process.env.MONGODB_URI
  const outFilename = process.argv[2] || path.join('backups', `graphs-${new Date().toISOString()}.json`)
  await mongoexportCollection(mongodbUri, 'graphs', outFilename)
}

backup()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
