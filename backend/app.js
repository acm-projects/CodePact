require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
// Routes
const leetcodeRoutes = require('./routes/leetcode');
const userRouter = require('./routes/user');

// Database
require('./models/db');

// Mount middleware and routes
app.use('/api', leetcodeRoutes);
app.use(express.json());
app.use(userRouter);

app.get('/test', (req, res) => {
  res.send('Hello world');
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome!' });
});

// Starts Server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.listen(8000, () => {
  console.log('port is listening');
});