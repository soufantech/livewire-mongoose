const mongoose = require('mongoose');

const messageInboxSchema = new mongoose.Schema({
  messageId: { type: String, unique: true, required: true },
  contextId: { type: String, unique: true, required: true },
  headers: { type: String },
  value: { type: Buffer },
  timestamp: { type: Date },
  topic: { type: String },
  partition: { type: Number },
  offset: { type: Number},
  key: { type: String },
  loggedAt: { type: Date, default: Date.now() },
}, { collection: 'inbox' });

module.exports = mongoose.model('MessageInbox', messageInboxSchema);
