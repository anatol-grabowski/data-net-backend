import { Db, Collection } from 'mongodb'

export class UserRepository {
  private collection: Collection

  constructor(
    private readonly mongodbDbConnection: Db,
  ) {
    this.collection = this.mongodbDbConnection.collection('users')
  }

  async create(user) {
    this.collection.insertOne({ u: 33 })
  }

  async findByUsername(username: string) {

  }
}
