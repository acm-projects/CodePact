const express = require('express');
require('dotenv').config(); 

const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Our DB Is Connected');
    })
    .catch(err => {
        console.error(err);
    });
    
const app = express()

app.get('/', (req, res) => {
    res.send('<h1>Hello User</h1>');
})

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});

// mongodb+srv://adixit0506_db_user:LBd4ff6e3H6i3a3C@code-pactdev.5qssrmb.mongodb.net/