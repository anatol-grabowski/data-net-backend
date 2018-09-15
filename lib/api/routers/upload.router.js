const express = require('express')
const asyncHandler = require('express-async-handler')
const formidable = require('formidable')
const { parseFormData, redirectFileParts } = require('redirect-form-data-files')

const router = express.Router()

function makeRedirectTargetStream(formDataFilePart) {
  console.log(formDataFilePart)
  const stream = require('stream')
  const wStream = new stream.PassThrough()
  wStream.on('data', (data) => console.log('data:', data))
  wStream.on('end', () => console.log('end'))
  wStream.on('error', (err) => console.log('error:', err))
  return wStream
}

router.post('/', asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm()
  redirectFileParts(form, makeRedirectTargetStream)
  await parseFormData(form, req)
  res.json({ok: true})
}))

exports.uploadRouter = router