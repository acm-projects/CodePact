const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Our DB Is Connected');
    })
    .catch(err => {
        console.error(err);
    });
    