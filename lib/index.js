const createInboxStorageAdapter = require('./inbox');
const createOutboxStorageAdapter = require('./outbox');

module.exports = {
  createInboxStorageAdapter,
  createOutboxStorageAdapter,
};
