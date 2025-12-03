const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  commenterName: { type: String, required: true },
  commenterId: { type: String, default: null }, 
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const ForumThreadSchema = new mongoose.Schema({
  // Reference to the job we are discussing. You can store job _id.
  //Reference to job document
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
  jobCode: { type: String, required: true },
  companyName: { type: String, required: true },

  // thread content
  title: { type: String, required: true }, 
  body: { type: String, required: true },  
  authorName: { type: String, required: true },
  authorId: { type: String, default: null }, 

  comments: { type: [CommentSchema], default: [] },

  // different identifiers and tags
  tags: { type: [String], default: [] }, 
  pinned: { type: Boolean, default: false },
  closed: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

ForumThreadSchema.index({ jobCode: 1, createdAt: -1 });
ForumThreadSchema.index({ companyName: 1, createdAt: -1 });

module.exports = mongoose.model('ForumThread', ForumThreadSchema);