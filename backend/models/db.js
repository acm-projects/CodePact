// models/db.js
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('❌ MONGO_URI missing in .env');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Mongo connect error:', err?.message || err);
    process.exit(1);
  });

module.exports = mongoose; // export
