const express = require('express')
const { asyncExpress } = require('../async-express')
const formidable = require('formidable')
const { parseFormData, redirectFileParts } = require('../../util/handle-form-data')

const router = express.Router()

function makeRedirectTargetStream(part) {
  console.log(part)
  const stream = require('stream')
  const wStream = new stream.PassThrough()
  wStream.on('data', (data) => console.log('data:', data))
  wStream.on('end', () => console.log('end'))
  wStream.on('error', (err) => console.log('error:', err))
  return wStream
}

router.post('/', asyncExpress(async (req, res) => {
  const form = new formidable.IncomingForm()
  redirectFileParts(form, makeRedirectTargetStream)
  await parseFormData(form, req)
  res.json({ok: true})
}))

exports.uploadRouter = router