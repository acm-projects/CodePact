const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI;

const express = require('express');
const cors = require('cors');
const forumRoutes = require('./routes/forum');
const adzunaRoutes = require('./routes/adzuna');
const app = express();
const notificationRoutes = require('./routes/notificationsRoutes');
const reminderRoutes = require('./routes/remindersRoutes');


app.use('/api/forum', forumRoutes);
app.use('/api/adzuna', adzunaRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/api/reminders', reminderRoutes);

app.use(cors());
app.use(express.json());

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
