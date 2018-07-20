const { MongoClient } = require('mongodb')

const mongo = {
  url: null,
  db: null,
  client: null,
  async connect(url) {
    this.url = url
    this.client = await MongoClient.connect(url)
    this.db = client.db()
  }
}

exports.mongo = mongo