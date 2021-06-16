const pg = require('../pg')
const crypto = require('crypto')
const User = require('./user')

class Note {

  static lastTotalCount = 0

  constructor ({ id, text, share_id, user_id }) {
    this.id = id
    this.text = text
    this.share_id = share_id
    this.user_id = user_id
    this.userObject = null
  }

  static async create ({ user_id, text }) {
    const res = await pg.query(
      `INSERT INTO "notes" ("user_id", "text")
       VALUES ($1, $2)
       RETURNING id`,
      [user_id, text],
    )

    return res && res.rows && res.rows[0]
      ? Note.findOneById(res.rows[0].id)
      : null
  }

  static async findOneById (id) {
    const note = await pg.oneOrNone(
      `SELECT *
       FROM "notes"
       WHERE "id" = $1
         AND "is_deleted" = false`,
      [id],
    )
    if (note) {
      return new this(note)
    }
    return null
  }

  static async findOneByShareId (user_id, share_id) {
    const note = await pg.oneOrNone(
      `SELECT *
       FROM "notes"
       WHERE "user_id" = $1
         AND "share_id" = $2
         AND "is_deleted" = false`,
      [user_id, share_id],
    )
    if (note) {
      return new this(note)
    }
    return null
  }

  static async findByUserId (user_id, offset = 0, limit = 10) {
    const res = await pg.manyOrNone(
      `SELECT *, count(*) OVER () AS total_count
       FROM "notes"
       WHERE user_id = $1
         AND "is_deleted" = false
       ORDER BY "updated_at" DESC
       OFFSET $2 LIMIT $3`,
      [user_id, offset, limit],
    )
    this.lastTotalCount = res && res[0] ? res[0].total_count : 0

    let models = []
    for (const item of res) {
      models.push(new this(await this.findOneById(item.id)))
    }
    return models
  }

  async save () {
    await pg.query(
      `UPDATE "notes"
       SET "text"     = $1,
           "share_id" = $2
       WHERE "id" = $3
         AND "is_deleted" = false`,
      [this.text, this.share_id, this.id],
    )
  }

  async delete () {
    await pg.query(
      `UPDATE "notes"
       SET "is_deleted" = true
       WHERE "id" = $1
         AND "is_deleted" = false`,
      [this.id],
    )
  }

  async share () {
    this.share_id = crypto.createHash('sha256').
      update(`${this.id}-${Date.now()}`).
      digest('hex')
    await this.save()
  }

  async unshare () {
    this.share_id = null
    await this.save()
  }

  get shareLink () {
    return `${process.env.APP_URL}/notes/shared/${this.user_id}/${this.share_id}`
  }

  async user () {
    if (!this.userObject) {
      this.userObject = await User.findById(this.user_id)
    }

    return this.userObject
  }

  get shared () {
    return !!this.share_id
  }
}

module.exports = Note