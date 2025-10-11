const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  code: String,
  category: String,
  description: String,
  skills: [String],
  techField: Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);