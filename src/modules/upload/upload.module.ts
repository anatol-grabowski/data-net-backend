import { UploadController } from './services/upload.controller'
import { DropboxModule } from '../dropbox'
import { Module } from '../../di'

export const UploadModule: Module = {
  providers: {
    'config': { importFrom: null },
    'dropboxSvc': { importFrom: 'Dropbox' },
    'uploadCtl': {
      doExport: true,
      dependencies: ['dropboxSvc'],
      create: (dropbox) => new UploadController(dropbox),
    },
  },
  submodules: {
    'Dropbox': { module: DropboxModule },
  },
}
