const pgp = require('pg-promise')(/* options */)
const connectionString = `postgres://${process.env.PG_USER || ''}:${process.env.PG_PASSWORD || ''}@` +
  `${process.env.PG_HOST ||
  'localhost'}:${process.env.PG_PORT}/${process.env.PG_DBNAME ||
  'wazzup_docs'}`;
console.log(connectionString)
const db = pgp(
  `postgres://${process.env.PG_USER || ''}:${process.env.PG_PASSWORD || ''}@` +
  `${process.env.PG_HOST ||
  'localhost'}:${process.env.PG_PORT}/${process.env.PG_DBNAME ||
  'wazzup_docs'}`,
)

module.exports = db