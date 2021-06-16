'use strict';

let dbm;
let type;
let seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.addIndex('users', 'users_username', ['username']);
  db.addIndex('notes', 'users_share_id', ['share_id']);
  db.addIndex('notes', 'users_is_deleted', ['is_deleted']);
  db.addForeignKey('notes', 'users', 'notes_user_id', {
    'user_id': 'id'
  }, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT'
  })
  return null
};

exports.down = function(db) {
  db.removeIndex('users', 'users_username');
  db.removeIndex('notes', 'users_share_id');
  db.removeIndex('notes', 'users_is_deleted');
  db.removeForeignKey('notes', 'notes_user_id');
  return null
};

exports._meta = {
  "version": 1
};
