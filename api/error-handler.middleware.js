const middleware = (error, request, response, next) => {
  console.log(`Error in ${request.method} ${request.originalUrl} endpoint:`)
  console.log(error)
  response.status(500)
  response.end(error.toString())
}

exports.errorHandlerMiddleware = middleware