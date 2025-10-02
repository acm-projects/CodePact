// controllers/user.js
const User = require('../models/user');

async function createUser(req, res) {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'fullname, email, and password are required',
      });
    }

    const isNewUser = await User.isThisEmailInUse(email);
    if (!isNewUser) {
      return res.status(409).json({
        success: false,
        message: 'This email is already in use. Try another email.',
      });
    }

    const user = new User({
      fullname: fullname.trim(),
      email: email.toLowerCase().trim(),
      password, // hash later with bcrypt
    });

    await user.save();
    const { password: _, ...safeUser } = user.toObject();
    return res.status(201).json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { createUser };
