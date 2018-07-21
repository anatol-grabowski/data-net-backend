const { MongoClient } = require('mongodb')

const mongo = {
  url: null,
  db: null,
  client: null,
  async connect(url) {
    this.url = url
    this.client = await MongoClient.connect(url, {useNewUrlParser: true})
    this.db = this.client.db()
  }
}

exports.mongo = mongo