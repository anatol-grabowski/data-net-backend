const express = require('express')
const { Auth } = require('./auth')

function getTokenPayload(usrPsw) {
  if (!usrPsw) {
    const anonUser = {anon: true}
    return {user: anonUser}
  }
  if (usrPsw.username !== usrPsw.password) return
  const user = {id: 123}
  return {user}
}
const jwtSecret = 'secret key'
const jwtOptions = { expiresIn: '7d' }
const auth = new Auth({getTokenPayload, jwtSecret, jwtOptions})

const authMiddlewareRouter = express.Router()
authMiddlewareRouter.use(auth.verifyCookieTokenMiddleware)
authMiddlewareRouter.use((req, res, next) => {
  console.log('authToken:', res.locals.authToken)
  res.locals.user = res.locals.authToken ? res.locals.authToken.payload : null
  next()
})

const router = express.Router()
router.get('/login', auth.getTokenHandler)

exports.authMiddlewareRouter = authMiddlewareRouter
exports.authRouter = router