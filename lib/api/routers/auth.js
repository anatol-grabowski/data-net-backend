const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

function getUsrPswFromAuthHeader(authorizationHeader) {
  if (!authorizationHeader) return
  const [ authType, authValue ] = authorizationHeader.split(' ')
  if (authType !== 'Basic') return
  const [ username, password ] = Buffer.from(authValue, 'base64').toString().split(':')
  return {username, password}
}

class Auth {
  constructor({getTokenPayload, responseFieldName='authToken', jwtSecret, jwtOptions, cookieFieldName='authToken'}) {
    this.getTokenPayloadByUsrPsw = getTokenPayload
    this.responseFieldName = responseFieldName
    this.jwtSecret = jwtSecret
    this.jwtOptions = jwtOptions
    this.cookieFieldName = cookieFieldName

    this.verifyCookieTokenMiddleware = (request, response, next) => {
      const token = request.cookies[this.cookieFieldName]
      if (!token) return next()
      try {
        const verifiedToken = jwt.verify(token, this.jwtSecret, this.jwtOptions)
        this._setTokenField(request, response, verifiedToken)
      } catch (e) {
        console.log('Ignored error while parsing auth token')
      }
      next()
    }
    this.getTokenHandler = asyncHandler(async (request, response) => {
      const usrPsw = getUsrPswFromAuthHeader(request.headers.authorization)
      const payload = await this.getTokenPayloadByUsrPsw(usrPsw)
      const token = jwt.sign({payload}, this.jwtSecret, this.jwtOptions)
      response.cookie(this.cookieFieldName, token, {httpOnly: true})
      response.json({token})
    })
  }

  _getTokenField(request, response) {
    return response.locals[this.responseFieldName]
  }

  _setTokenField(request, response, token) {
    response.locals[this.responseFieldName] = token
  }
}

exports.Auth = Auth