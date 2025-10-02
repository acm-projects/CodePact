const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 


// Defining types of data we are storing 
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true 
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String, 
        required: true
    }

})

// Hash Function for Password
userSchema.pre('save', function(){
    if(this.isModified('password')){
        bcrypt.hash(this.password, 8, (err, has) => {
            if(err) return next(err);
            
            this.password = hash;
            next();
        })
    }
})

userSchema.statics.isThisEmailInUse = async function(email) {
    if(!email) throw new Error('Invalid Email')
    try {
    const user = await this.findOne({email})
    if(user) return false

    return true;
    
    } catch (error) {
        console.log('error inside isThisEmailInUse method', error.message)
        return false
    }
}

// remove stray reference; methods are defined above if needed

module.exports = mongoose.model('User', userSchema);