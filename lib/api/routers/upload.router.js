const express = require('express')
const asyncHandler = require('express-async-handler')
const formidable = require('formidable')
const { parseFormData, redirectFileParts } = require('redirect-form-data-files')
const { dropbox } = require('../../storage/dropbox')

const router = express.Router()

class Uploader {
  constructor() {
    this.writeStream = null
    this.metadata = null
    this.error = null
  }

  createUploadStream(formDataFilePart) {
    // console.log(formDataFilePart)
    const filepath = '/' + formDataFilePart.filename
    const writeStream = dropbox.createDropboxUploadStream(filepath)
    writeStream.on('metadata', metadata => {
      this.metadata = metadata
      if (this._resolve) this._resolve(metadata)
    })
    writeStream.on('error', error => {
      this.error = error
      if (this._reject) this._reject(error)
    })
    this.writeStream = writeStream
    return writeStream
  }

  async waitWriteStream() {
    if (this.error) return Promise.reject(this.error)
    if (this.metadata) return Promise.resolve(this.metadata)
    return new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }
}

router.post('/', asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm()
  const uploader = new Uploader()
  redirectFileParts(form, uploader.createUploadStream.bind(uploader))
  await parseFormData(form, req)
  const uploadMetadata = await uploader.waitWriteStream()
  res.json({ok: true, metadata: uploadMetadata})
}))

exports.uploadRouter = router