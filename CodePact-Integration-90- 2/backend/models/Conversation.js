const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
    lastMessageAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);