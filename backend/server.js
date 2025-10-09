require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const onetRoutes = require('./routes/onet');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/onet', onetRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
