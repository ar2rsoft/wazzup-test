const pg = require('../pg')

class User {

  constructor ({ id, username }) {
    this.id = id
    this.username = username
  }

  static async create ({ username, password }) {
    await pg.none(
      `INSERT INTO "users" ("username", "password") VALUES($1, crypt($2, gen_salt('bf')))`,
      [username, password]
    )

    return User.findByUsername(username)
  }

  static async findByUsername (username) {
    const user = await pg.oneOrNone(
      `SELECT *
       FROM "users"
       WHERE "username" = $1`,
      [username],
    )
    if (user) {
      return new this(user)
    }
    return null
  }

  static async findById (id) {
    const user = await pg.oneOrNone(
      `SELECT *
       FROM "users"
       WHERE "id" = $1`,
      [id],
    )
    if (user) {
      return new this(user)
    }
    return null
  }

  static async findByUsernameAndPassword(username, passowrd) {
    const user = await pg.oneOrNone(
      `SELECT * 
        FROM users WHERE username = $1 and "password"  = crypt($2, "password" );`,
      [username, passowrd]
    )
    if (user) {
      return new this(user)
    }
    return null
  }

  async delete () {
    await pg.query(
      `DELETE FROM "users"
       WHERE "id" = $1`,
      [this.id],
    )
  }
}

module.exports = User