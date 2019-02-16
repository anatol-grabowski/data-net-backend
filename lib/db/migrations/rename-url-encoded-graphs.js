const { mongo } = require('../mongo')

async function up() {
  const mongodbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/graphs'
  await mongo.connect(mongodbUrl)
  const graphs = await mongo.db.collection('graphs').find({}).toArray()
  const updatePromises = graphs.map(async gr => {
    console.log(gr.name, '- will be -', decodeURIComponent(gr.name))
    console.log(decodeURIComponent(gr.name))
    gr.name = decodeURIComponent(gr.name)
    // await mongo.db.collection('graphs').save(gr)
  })
  await Promise.all(updatePromises)
  mongo.client.close()
}

up()
  .catch(err => {
    console.log(err)
    mongo.client.close()
  })
