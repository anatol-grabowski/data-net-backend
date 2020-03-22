export const config = {
  apiPort: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET,
  mongodbUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/graphs',
  dropboxAccessToken: process.env.DROPBOX_ACCESS_TOKEN,
}
