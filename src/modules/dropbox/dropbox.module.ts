import { dropbox } from './services/dropbox'

export const DropboxModule = {
  name: 'Dropbox',
  providers: {
    'config': null,
    'dropboxSvc': {
      dependencies: ['config'],
      create: async (config) => {
        const dropboxSvc = dropbox
        await dropboxSvc.authenticate(config.dropboxAccessToken)
        return dropboxSvc
      },
    },
  },
  imports: {
    'config': 'config',
  },
  exports: {
    'dropboxSvc': 'dropboxSvc',
  },
}
