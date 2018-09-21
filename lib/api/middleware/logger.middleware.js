function requestLoggerMiddleware(request, response, next) {
  console.log(`HTTP request  "${request.method} ${request.originalUrl}":`)
  console.log({query: request.query, body: request.body})
  next()
}

function responseLoggerMiddleware(request, response, next) {
  const startTime = new Date()
  const chunks = []
  const shouldSkip = shouldSkipUrl(request.originalUrl)
  if (!shouldSkip) teeResponse(response, chunks)
  response.on('finish', () => {
    const body = shouldSkip ? null : Buffer.concat(chunks).toString('utf8')
    const logObj = {
      statusCode: response.statusCode,
      body,
      executionTimeMs: +new Date() - startTime,
    }
    console.log(`HTTP response "${request.method} ${request.originalUrl}":`)
    console.log(logObj)
  })
  next()
}

function shouldSkipUrl(url) {
  const skipUrlRegexps = [/^\/download/]
  const shouldSkip = skipUrlRegexps.some(re => re.test(url))
  return shouldSkip
}

function teeResponse(response, chunks) {
  const originalWrite = response.write
  const originalEnd = response.end
  response.write = function (chunk) {
    chunks.push(Buffer.from(chunk))
    originalWrite.apply(response, arguments)
  }
  response.end = function (chunk) {
    if (chunk) chunks.push(Buffer.from(chunk))
    originalEnd.apply(response, arguments)
  }
}

exports.requestLoggerMiddleware = requestLoggerMiddleware
exports.responseLoggerMiddleware = responseLoggerMiddleware