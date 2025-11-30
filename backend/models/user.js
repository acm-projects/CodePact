const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 


// Defining types of data we are storing 
// Note: Database may have 'email' or 'emailAddress' field - schema supports both
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    
    fullname: {
        type: String  // Some users might have fullname instead of name
    },

    emailAddress: {
        type: String
    },
    
    email: {
        type: String  // Some users might have email instead of emailAddress
    },
    
    emailAdress: {
        type: String  // Typo variant
    },

    password: {
        type: String, 
        required: true
    }

}, { strict: false })  // strict: false allows fields not in schema

// Hash Function for Password
userSchema.pre('save', function(next){
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 8, (err, hash) => {
            if (err) return next(err);

            this.password = hash;
            return next();
        });
    } else {
        // password not modified, continue
        return next();
    }
})

userSchema.methods.comparePassword = async function (password) {
    if(!password) throw new Error('Password is missing, can not compare!')

    try {
        // Check if password is stored as bcrypt hash (starts with $2a$, $2b$, or $2y$)
        const isHashed = this.password && (
            this.password.startsWith('$2a$') || 
            this.password.startsWith('$2b$') || 
            this.password.startsWith('$2y$')
        );
        
        if (isHashed) {
            // Password is hashed, use bcrypt comparison
            const result = await bcrypt.compare(password, this.password);
            console.log('🔐 [PASSWORD] Comparing with bcrypt hash');
            return result;
        } else {
            // Password is stored as plain text (for migration purposes)
            // Direct comparison
            const result = password === this.password;
            console.log('🔐 [PASSWORD] Comparing plain text passwords');
            console.log('🔐 [PASSWORD] Input password:', password);
            console.log('🔐 [PASSWORD] Stored password:', this.password);
            console.log('🔐 [PASSWORD] Match:', result);
            
            // If match found and password is plain text, hash it for future use
            if (result && this.isModified) {
                console.log('🔐 [PASSWORD] Password matched (plain text). Consider hashing it in the database.');
            }
            
            return result;
        }
    } catch (error) {
        console.log('Error while comparing password!', error.message)
        return false;
    }
}


userSchema.statics.isThisEmailInUse = async function(emailAddress) {
    if(!emailAddress) throw new Error('Invalid Email')
    try {
    const user = await this.findOne({emailAddress})
    if(user) return false

    return true;
    
    } catch (error) {
        console.log('error inside isThisEmailInUse method', error.message)
        return false
    }
}

// remove stray reference; methods are defined above if needed

module.exports = mongoose.models.User || mongoose.model('User', userSchema);