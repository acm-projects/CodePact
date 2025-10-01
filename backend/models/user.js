const mongoose = require('mongoose');


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

userSchema.statics.isThisEmailInUse = async function(email) {
    if(!email) throw new Error('Invalid Email')
    try {
    const user = await this.findOne({email})
    if(user) return false

    return true;
    
    } catch (erorr) {
        console.log('error inside isThisEmailInUse method', error.message )
        return false
    }
}
userSchema.methods.isThisEmailInUse

module.exports = mongoose.model('User', userSchema);