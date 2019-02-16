const { mongo } = require('../mongo')

const username = process.argv[2]
const password = process.argv[3]

async function up() {
  const mongodbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/graphs'
  await mongo.connect(mongodbUrl)
  const usersCollection = mongo.db.collection('users')
  await usersCollection.createIndex({ username: 1}, { unique: true })
  console.log('index created')
  await usersCollection.insertOne({ username, password })
  console.log('user inserted')
  mongo.client.close()
}

up()
  .catch(err => {
    console.log(err)
    mongo.client.close()
  })
