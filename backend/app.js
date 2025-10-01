const express = require('express');
require('dotenv').config(); 
require('./models/db');

const User = require('./models/user')
    
const app = express()

const email = 'john1@email.com'


app.post('/create-user', async (req, res) => {

    const isNewUser =  await User.isThisEmailInUse('john1@email.com')
    if(!isNewUser) return res.json({
        success: false, 
        message: 'This email is already in use try another email',

    });

    const user = await User({
        fullname: 'John Doe', 
        email: 'john1@email.com', 
        password: '1234',
    });
    await user.save();
    res.json(user);
});


app.get('/', (req, res) => {
    res.send('<h1>Hello User</h1>');
})

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});

// mongodb+srv://adixit0506_db_user:LBd4ff6e3H6i3a3C@code-pactdev.5qssrmb.mongodb.net/