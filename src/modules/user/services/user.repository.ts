import { Db } from 'mongodb'

export class UserRepository {
  constructor(
    private readonly mongodbDbConnection: Db,
  ) {}

  async create() {

  }

  async findByUsername(username: string) {

  }
}
