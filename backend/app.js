const express = require('express');
require('dotenv').config(); 
require('./models/db');
const userRouter = require('./routes/user')

const User = require('./models/user')

const app = express()

// Use express.json() to safely parse JSON bodies (handles chunking/errors)
app.use(express.json())

// Mount routers
app.use(userRouter)

app.get('/test', (req, res) => {
    res.send('Hello World');
});



app.get('/', (req, res) => {
    res.send('<h1>Hello User</h1>');
})

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});

// mongodb+srv://adixit0506_db_user:LBd4ff6e3H6i3a3C@code-pactdev.5qssrmb.mongodb.net/