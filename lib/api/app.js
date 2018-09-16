const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { graphRouter } = require('./routers/graph-mongo.router')
const { statusRouter } = require('./routers/status.router')
const { uploadRouter } = require('./routers/upload.router')
const { requestLoggerMiddleware, responseLoggerMiddleware } = require('./middleware/logger.middleware')
const { errorHandlerMiddleware } = require('./middleware/error-handler.middleware')

const app = express()
app.use(responseLoggerMiddleware)
app.use(cors())
app.use(bodyParser.json())
app.use(requestLoggerMiddleware)

app.use('/status', statusRouter)
app.use('/graph', graphRouter)
// app.use('/graphFile', require('./routers/graph-file.router').graphRouter)
app.use('/', uploadRouter)

app.use(errorHandlerMiddleware)

exports.app = app