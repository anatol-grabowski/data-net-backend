import { dropbox } from './services/dropbox'
import { Module } from '../../di'

export const DropboxModule: Module = {
  providers: {
    'config': { importFrom: null },
    'dropboxSvc': {
      doExport: true,
      dependencies: ['config'],
      create: async (config) => {
        const dropboxSvc = dropbox
        await dropboxSvc.authenticate(config.dropboxAccessToken)
        return dropboxSvc
      },
    },
  },
}
