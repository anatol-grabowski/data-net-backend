const stream = require('stream')

async function formidableParseFormPromise(form, request) {
  return new Promise((resolve, reject) => {
    form.parse(request, (err, fields, files) => {
      if (err) return reject(err)
      resolve({fields, files})
    })
  })
}

function formidableRedirectFileParts(form, getRedirectStream) {
  form.onPart = part => {
    if (!part.filename) {
      form.handlePart(part)
      return
    }
    const redirectStream = getRedirectStream(part)
    part.pipe(redirectStream)
  }
}

function getConsoleLogStream() {
  const wStream = new stream.PassThrough()
  wStream.on('data', (data) => console.log('data:', data))
  wStream.on('end', () => console.log('end'))
  wStream.on('error', (err) => console.log('error:', err))
  return wStream
}

exports.parseFormData = formidableParseFormPromise
exports.redirectFileParts = formidableRedirectFileParts
exports.getConsoleLogStream = getConsoleLogStream