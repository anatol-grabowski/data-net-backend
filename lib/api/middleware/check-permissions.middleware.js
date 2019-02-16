const checkPermissions = permissions => (req, res, next) => {
  const user = res.locals.user
  const isAuthorized = user && permissions.every(perm => {
    user.permissions.includes(perm)
  })
  if (!isAuthorized) throw Error('Unauthorized')
  next()
}

exports.checkPermissions = checkPermissions