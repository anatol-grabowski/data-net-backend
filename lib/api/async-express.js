const asyncExpress = asyncController => (req, res, next) => {
  return Promise.resolve(asyncController(req, res, next)).catch(next)
}

exports.asyncExpress = asyncExpress