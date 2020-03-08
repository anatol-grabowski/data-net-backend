import { MongoClient, Db } from 'mongodb'

export class MongodbService {
  private url: string | null
  private client: MongoClient | null
  db: Db | null

  constructor() {
    this.url = null
    this.client = null
    this.db = null
  }

  async connect(url: string) {
    this.url = url
    this.client = await MongoClient.connect(url, {useNewUrlParser: true})
    this.db = this.client.db()
  }
}
