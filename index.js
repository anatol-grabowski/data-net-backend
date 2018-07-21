const { start } = require('./lib/datanet-backend')

start()
  .catch(err => {
    console.log(err)
    process.exit(1)
  })