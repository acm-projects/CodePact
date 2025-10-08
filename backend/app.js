require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes 
const leetcodeRoutes = require('./routes/leetcode');
app.use('/api', require('./routes/leetcode'));

// Starts Server
app.listen(PORT, () => {
    console.log('Server listening on http:localhost:$[PORT}');
})


// Routes for Auth
require('./models/db');
const userRouter = require('./routes/user');
const User = require('./models/user');




// Auth 
app.use(express.json());
app.use(userRouter);

const test = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    console.log('No user found for', email);
    return;
  }
  const result = await user.comparePassword(password);
  console.log(result);
};

 // test('niraj@email.com', 'niraj12');

app.get('/test', (req, res) => {
  res.send('Hello world');
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome!' });
});

app.listen(8000, () => {
  console.log('port is listening');
});