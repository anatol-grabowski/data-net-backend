import { UploadController } from './services/upload.controller'
import { DropboxModule } from '../dropbox'
import { Module } from 'perfect-di'

export const UploadModule: Module = {
  providers: {
    'config': { importFrom: null },
    'dropboxSvc': { importFrom: 'Dropbox' },
    'uploadCtl': {
      doExport: true,
      dependencies: ['dropboxSvc'],
      init: (dropbox) => new UploadController(dropbox),
    },
  },
  submodules: {
    'Dropbox': { module: DropboxModule },
  },
}
