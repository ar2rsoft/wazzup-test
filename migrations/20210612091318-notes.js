'use strict'

let dbm
let type
let seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function (db) {
  return db.createTable('notes', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: { type: 'int' },
    text: { type: 'varchar(1000)' },
    share_id: { type: 'varchar(64)', defaultValue: new String('null') },
    is_deleted: { type: 'boolean', defaultValue: false },

    created_at: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP'),
    },
  })
}

exports.down = function (db) {
  return db.dropTable('notes')
}

exports._meta = {
  'version': 1,
}
