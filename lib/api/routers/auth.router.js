const express = require('express')
const { Auth } = require('./auth')

function verifyUserPassword(usrPsw) {
  if (!usrPsw) {
    const anonUser = {anon: true}
    return anonUser
  }
  if (usrPsw.username !== usrPsw.password) return
  const usr = {id: 123}
  return usr
}
const jwtSecret = 'secret key'
const jwtOptions = { expiresIn: '7d' }
const auth = new Auth({verifyUserPassword, jwtSecret, jwtOptions})

const authMiddlewareRouter = express.Router()
authMiddlewareRouter.use(auth.verifyCookieTokenMiddleware)
authMiddlewareRouter.use((req, res, next) => {
  console.log('user:', res.locals.user)
  next()
})

const router = express.Router()
router.get('/login', auth.getTokenHandler)

exports.authMiddlewareRouter = authMiddlewareRouter
exports.authRouter = router