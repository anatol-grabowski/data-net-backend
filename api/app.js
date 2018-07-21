const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { graphRouter } = require('./graph-mongo.router')
const { statusRouter } = require('./status.router')
const { requestLoggerMiddleware, responseLoggerMiddleware } = require('./logger.middleware')
const { errorHandlerMiddleware } = require('./error-handler.middleware')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(requestLoggerMiddleware)
app.use(responseLoggerMiddleware)

app.use('/status', statusRouter)
app.use('/graph', graphRouter)

app.use(errorHandlerMiddleware)

exports.app = app