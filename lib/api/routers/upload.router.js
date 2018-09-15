const express = require('express')
const asyncHandler = require('express-async-handler')
const formidable = require('formidable')
const { parseFormData, redirectFileParts } = require('redirect-form-data-files')
const { DropboxUploadsAwaiter } = require('../../util/dropbox-uploads-awaiter')

const router = express.Router()

router.post('/', asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm()
  const uploader = new DropboxUploadsAwaiter()
  redirectFileParts(form, uploader.createUploadStream.bind(uploader))
  await parseFormData(form, req)
  const uploadsMetadatas = await uploader.waitWriteStreams()
  res.json({ok: true, metadatas: uploadsMetadatas})
}))

exports.uploadRouter = router