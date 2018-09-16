const express = require('express')
const asyncHandler = require('express-async-handler')
const formidable = require('formidable')
const { dropbox } = require('../../storage/dropbox')
const { parseFormData, redirectFileParts } = require('redirect-form-data-files')
const { EventsAwaiter } = require('events-awaiter')

const router = express.Router()

router.post('/', asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm()
  const uploadsAwaiter = new EventsAwaiter()
  const createRedirectStream = (formDataFilePart) => {
    const filepath = '/' + formDataFilePart.filename
    const writeStream = dropbox.createUploadStream(filepath)
    uploadsAwaiter.addEvent(writeStream, 'metadata')
    return writeStream
  }
  redirectFileParts(form, createRedirectStream)
  await parseFormData(form, req)
  const uploadsMetadatas = await uploadsAwaiter.awaitEvents()
  res.json({ok: true, metadatas: uploadsMetadatas})
}))

exports.uploadRouter = router