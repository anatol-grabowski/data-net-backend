const express = require('express')
const asyncHandler = require('express-async-handler')
const formidable = require('formidable')
const { dropbox } = require('../../storage/dropbox')
const { parseFormData, redirectFileParts } = require('redirect-form-data-files')
const { EventsAwaiter } = require('events-awaiter')
const path = require('path')

const router = express.Router()

router.post('/upload', asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm()
  const uploadsAwaiter = new EventsAwaiter()
  const createRedirectStream = (formDataFilePart) => {
    const filepath = '/' + formDataFilePart.filename
    const writeStream = dropbox.createUploadStream(filepath)
    uploadsAwaiter.addEvent(writeStream, 'metadata')
    writeStream.on('progress', progr => console.log(`dropbox uploaded bytes (${filepath}):`, progr))
    return writeStream
  }
  redirectFileParts(form, createRedirectStream)
  await parseFormData(form, req)
  const uploadsMetadatas = await uploadsAwaiter.awaitEvents()
  res.json({ok: true, metadatas: uploadsMetadatas})
}))

router.get('/download', asyncHandler(async (req, res) => {
  const filepath = req.query.filepath
  console.log('get file', filepath)
  let filename = path.basename(filepath)
  filename = encodeURI(decodeURI(filename)) //for cyrillic symbols
  res.setHeader('Content-disposition', 'attachment; filename=' + filename)
  res.setHeader('Content-Type', 'application/octet-stream')
  const fileInfo = await dropbox.dbx.filesGetMetadata({path: filepath})
  res.setHeader('Content-Length', fileInfo.size)
  const readStream = dropbox.createDownloadStream(filepath)
  // readStream.on('progress', progr => console.log(`dropbox downloaded bytes (${filepath}) [${fileInfo.size}]:`, progr))
  readStream.on('error', () => {
    console.log('error in stream')
    res.removeHeader('Content-disposition')
    res.removeHeader('Content-Type')
    res.status(500)
    res.send('error in file readStream')
  })
  readStream.pipe(res)
}))

exports.uploadRouter = router