const usersCollection

class UserRepository {
  constructor(db) {
    this.db = db
    this.collection = db.collection('users')
  }

  async getUserByName(username) {
    const user = await this.collection.find({ username })
    return user
  }
}
