const mongoose = require('mongoose');

const messageInboxSchema = new mongoose.Schema({
  messageId: { type: String, unique: true, required: true },
  timestamp: { type: Date },
  topic: { type: String },
  partition: { type: Number },
  offset: { type: Number },
  key: { type: String },
}, { collection: 'inbox' });

module.exports = mongoose.model('MessageInbox', messageInboxSchema);
