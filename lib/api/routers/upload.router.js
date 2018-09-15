const express = require('express')
const asyncHandler = require('express-async-handler')
const formidable = require('formidable')
const { parseFormData, redirectFileParts } = require('redirect-form-data-files')
const { dropbox } = require('../../storage/dropbox')

const router = express.Router()

function createUploadStream(formDataFilePart) {
  console.log(formDataFilePart)
  const filepath = '/' + formDataFilePart.filename
  const writeStream = dropbox.createDropboxUploadStream(filepath)
  writeStream.on('metadata', metadata => console.log('Metadata:', metadata))
  return writeStream
}

router.post('/', asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm()
  redirectFileParts(form, createUploadStream)
  const r = await parseFormData(form, req)
  console.log(r)
  res.json({ok: true})
}))

exports.uploadRouter = router