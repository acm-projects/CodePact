const express = require('express');
require('dotenv').config();
require('./models/db');

const userRouter = require('./routes/user');
const User = require('./models/user');

const app = express();



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