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
  constructor({verifyUserPassword, responseUserFieldName='user', jwtSecret, jwtOptions, cookieTokenFieldName='token'}) {
    this.verifyUserPassword = verifyUserPassword
    this.responseUserFieldName = responseUserFieldName
    this.jwtSecret = jwtSecret
    this.jwtOptions = jwtOptions
    this.cookieTokenFieldName = cookieTokenFieldName

    this.verifyCookieTokenMiddleware = (request, response, next) => {
      const token = request.cookies[this.cookieTokenFieldName]
      if (!token) return next()
      try {
        const verifiedToken = jwt.verify(token, this.jwtSecret, this.jwtOptions)
        this._setUserField(request, response, verifiedToken.user)
      } catch (e) {
        console.log('Ignored error while parsing auth token')
      }
      next()
    }
    this.verifyBasicMiddleware = asyncHandler(async (request, response, next) => {
      const usrPsw = getUsrPswFromAuthHeader(request.headers.authorization)
      const user = await this.verifyUserPassword(usrPsw)
      this._setUserField(request, response, user)
      next()
    })
    this.setCookieTokenMiddleware = (request, response, next) => {
      const user = this._getUserField(request, response)
      const token = this.createToken(user)
      response.cookie(this.cookieTokenFieldName, token, {httpOnly: true})
      next()
    }
    this.getTokenHandler = asyncHandler(async (request, response) => {
      this._setUserField(request, response, null)
      await this.verifyBasicMiddleware(request, response, () => {})
      this.setCookieTokenMiddleware(request, response, () => {})
      const user = this._getUserField(request, response)
      const token = this.createToken(user)
      response.json({token})
    })
  }

  createToken(user) {
    const token = jwt.sign({user}, this.jwtSecret, this.jwtOptions)
    return token
  }

  _getUserField(request, response) {
    return response.locals[this.responseUserFieldName]
  }

  _setUserField(request, response, user) {
    response.locals[this.responseUserFieldName] = user
  }
}

exports.Auth = Auth