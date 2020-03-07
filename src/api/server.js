const { app } = require('./app')

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