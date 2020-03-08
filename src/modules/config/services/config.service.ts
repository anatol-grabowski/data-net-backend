export const config = {
  serverPort: process.env.PORT || 8080,
  mongodbUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/graphs',
  dropboxAccessToken: process.env.DROPBOX_ACCESS_TOKEN,
}
