const mongoose = require('mongoose');

const messageOutboxSchema = new mongoose.Schema({
  messageId: { type: String, unique: true },
  headers: { type: mongoose.SchemaTypes.Mixed },
  value: { type: Buffer, required: true },
  topic: { type: String },
  partition: { type: Number },
  key: { type: String },
  clearedAt: { type: Date },
  createdAt: { type: Date, default: Date.now() },
}, { collection: 'outbox' });

module.exports =  mongoose.model('MessageOutbox', messageOutboxSchema);
