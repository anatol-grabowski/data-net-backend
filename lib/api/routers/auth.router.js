const express = require('express')
const jwt = require('jsonwebtoken')
const basicAuth = require('basic-auth')
const asyncHandler = require('express-async-handler')

const jwtSecret = 'secret key'
const jwtOptions = { expiresIn: '7d' }
const tokenCookieName = 'authToken'
const tokenHeaderName = 'auth-token'

const authCookieMiddleware = (req, res, next) => {
  const token = req.cookies[tokenCookieName]
  if (!token) return next()
  try {
    const verifiedToken = jwt.verify(token, jwtSecret, jwtOptions)
    res.locals.authToken = verifiedToken
    res.locals.user = verifiedToken ? verifiedToken.payload : null
  } catch (e) {
    console.log('Ignored error while parsing auth token')
  }
  next()
}

const authHeaderMiddleware = (req, res, next) => {
  const token = req.headers[tokenHeaderName]
  if (!token) return next()
  try {
    const verifiedToken = jwt.verify(token, jwtSecret, jwtOptions)
    res.locals.authToken = verifiedToken
    res.locals.user = verifiedToken ? verifiedToken.payload : null
  } catch (e) {
    console.log('Ignored error while parsing auth token')
  }
  next()
}

const router = express.Router()
router.get('/login', asyncHandler(async (req, res) => {
  const { name, pass } = basicAuth.parse(req.headers.authorization) || {}
  const userObj = { username: name }
  const payload = userObj
  const authToken = jwt.sign({payload}, jwtSecret, jwtOptions)
  // res.cookie(tokenCookieName, authToken, {httpOnly: true})
  res.json({ authToken })
}))

exports.authHeaderMiddleware = authHeaderMiddleware
exports.authRouter = router
