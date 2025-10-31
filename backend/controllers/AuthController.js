const User = require('../models/user');

exports.createUser = async (req, res) => {
    console.log("RAN");
    
  try {
    const { fullname, email, password } = req.body;
    console.log(fullname+" "+email+" "+password);
    console.log(email);
    const isNewUser = await User.isThisEmailInUse(email);
    if (!isNewUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already in use, try sign-in',
      });
    }

    const user = new User({ fullname, email, password });
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj });
  } catch (error) {
    console.error('createUser error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.userSignIn = async (req, res) => {
  try {
    console.log("FAILED");
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        success: false,
        message: 'user not found, with the given email!',
      });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: 'email / password does not match!',
      });

    const userObj = user.toObject();
    delete userObj.password;
    console.log("User signed in");
    req.session.user = userObj;
    console.log(req.session.user.fullname);
    res.json({ success: true, message: 'Sign-in successful', user: userObj });
  } catch (error) {
    console.error('userSignIn error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
