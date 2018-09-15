const { dropbox } = require('../storage/dropbox')

class DropboxUploadsAwaiter {
  constructor() {
    this.writeStreamStatuses = []
    this._resolve = null
    this._reject = null
  }

  findStatus(writeStream) {
    const status = this.writeStreamStatuses.find(stat => stat.writeStream === writeStream)
    return status
  }

  _tryResolve() {
    const erroredStatus = this.writeStreamStatuses.find(stat => stat.error)
    if (erroredStatus && this._reject) return this._reject(erroredStatus.error)
    const allDone = this.writeStreamStatuses.every(stat => stat.metadata)
    if (!allDone) return
    const metadatas = this.writeStreamStatuses.map(stat => stat.metadata)
    if (this._resolve) this._resolve(metadatas)
  }

  createUploadStream(formDataFilePart) {
    const filepath = '/' + formDataFilePart.filename
    const writeStream = dropbox.createDropboxUploadStream(filepath)
    writeStream.on('metadata', metadata => {
      const status = this.findStatus(writeStream)
      status.metadata = metadata
      this._tryResolve()
    })
    writeStream.on('error', error => {
      this.error = error
      this._tryResolve()
    })
    this.writeStreamStatuses.push({
      writeStream,
      metadata: null,
      error: null,
    })
    return writeStream
  }

  async waitWriteStreams() {
    const waitPromise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
    this._tryResolve()
    return waitPromise
  }
}

exports.DropboxUploadsAwaiter = DropboxUploadsAwaiter

