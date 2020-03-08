import { UploadController } from './services/upload.controller'
import { DropboxModule } from '../dropbox'

export const UploadModule = {
  name: 'Upload',
  providers: {
    'config': null,
    'dropboxSvc': null,
    'uploadCtl': {
      dependencies: ['dropboxSvc'],
      create: (dropbox) => new UploadController(dropbox),
    },
  },
  submodules: [
    DropboxModule,
  ],
  imports: {
    'config': 'config',
  },
  exports: {
    'uploadCtl': 'uploadCtl',
  },
}
