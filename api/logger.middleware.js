const requestLoggerMiddleware = (request, response, next) => {
  console.log(`HTTP request  "${request.method} ${request.originalUrl}":`)
  console.log({body: request.body})
  next()
}

function responseLoggerMiddleware(request, response, next) {
  const originalWrite = response.write
  const originalEnd = response.end
  const chunks = []

  response.write = function (chunk) {
    chunks.push(Buffer.from(chunk))
    originalWrite.apply(response, arguments)
  }

  response.end = function (chunk) {
    if (chunk) chunks.push(Buffer.from(chunk))
    const body = Buffer.concat(chunks).toString('utf8')
    console.log(`HTTP response "${request.method} ${request.originalUrl}":`)
    console.log({
      statusCode: response.statusCode,
      body
    })
    originalEnd.apply(response, arguments)
  }

  next()
}

exports.requestLoggerMiddleware = requestLoggerMiddleware
exports.responseLoggerMiddleware = responseLoggerMiddleware