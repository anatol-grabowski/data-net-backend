import { dropbox } from './services/dropbox'
import { Module } from 'perfect-di'

export const DropboxModule: Module = {
  providers: {
    'config': { importFrom: null },
    'dropboxSvc': {
      doExport: true,
      dependencies: ['config'],
      init: async (config) => {
        const dropboxSvc = dropbox
        await dropboxSvc.authenticate(config.dropboxAccessToken)
        return dropboxSvc
      },
    },
  },
}
