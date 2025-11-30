const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    console.log("🟡 [SIGNUP BACKEND] ========== Signup attempt started ==========");
    console.log("🟡 [SIGNUP BACKEND] Request body:", {
      name: req.body.name,
      emailAddress: req.body.emailAddress,
      emailAdress: req.body.emailAdress, // legacy support
      passwordLength: req.body.password ? req.body.password.length : 0,
      hasPassword: !!req.body.password
    });
    
  try {
    // Support both emailAddress and emailAdress for backward compatibility
    const emailAddress = req.body.emailAddress || req.body.emailAdress;
    const { name, password } = req.body;
    
    // Validate required fields
    if (!name || !emailAddress || !password) {
      console.log("❌ [SIGNUP BACKEND] Validation failed - missing fields");
      console.log("❌ [SIGNUP BACKEND] - name:", name ? "provided" : "MISSING");
      console.log("❌ [SIGNUP BACKEND] - emailAddress:", emailAddress ? "provided" : "MISSING");
      console.log("❌ [SIGNUP BACKEND] - password:", password ? "provided" : "MISSING");
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    console.log("🟡 [SIGNUP BACKEND] Checking if email is already in use:", emailAddress);
    const isNewUser = await User.isThisEmailInUse(emailAddress);
    console.log("🟡 [SIGNUP BACKEND] Email available:", isNewUser);
    
    if (!isNewUser) {
      console.log("❌ [SIGNUP BACKEND] Email already in use");
      return res.status(400).json({
        success: false,
        message: 'This email is already in use, try sign-in',
      });
    }

    console.log("🟡 [SIGNUP BACKEND] Creating new user...");
    const user = new User({ name, emailAddress, password });
    console.log("🟡 [SIGNUP BACKEND] Saving user to database...");
    await user.save();
    console.log("✅ [SIGNUP BACKEND] User saved successfully with ID:", user._id);

    const userObj = user.toObject();
    delete userObj.password;
    
    console.log("✅ [SIGNUP BACKEND] User object (without password):", {
      _id: userObj._id,
      name: userObj.name,
      emailAddress: userObj.emailAddress
    });
    console.log("✅ [SIGNUP BACKEND] ========== Signup successful ==========");

    res.json({ success: true, user: userObj });
  } catch (error) {
    console.error("❌ [SIGNUP BACKEND] ========== ERROR ==========");
    console.error('❌ [SIGNUP BACKEND] createUser error:', error);
    console.error('❌ [SIGNUP BACKEND] Error message:', error.message);
    console.error('❌ [SIGNUP BACKEND] Error code:', error.code);
    
    // Handle duplicate key error (MongoDB unique constraint)
    if (error.code === 11000) {
      console.log("❌ [SIGNUP BACKEND] Duplicate key error - email already exists");
      return res.status(400).json({
        success: false,
        message: 'This email is already in use',
      });
    }
    console.error('❌ [SIGNUP BACKEND] Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.userSignIn = async (req, res) => {
  console.log("🟢 [LOGIN BACKEND] ========== Login attempt started ==========");
  console.log("🟢 [LOGIN BACKEND] Full request body:", JSON.stringify(req.body, null, 2));
  console.log("🟢 [LOGIN BACKEND] Request body keys:", Object.keys(req.body));
  console.log("🟢 [LOGIN BACKEND] Request body.emailAddress:", req.body.emailAddress);
  console.log("🟢 [LOGIN BACKEND] Request body.emailAdress:", req.body.emailAdress);
  console.log("🟢 [LOGIN BACKEND] Request body.email:", req.body.email);
  
  try {
    // Support both emailAddress and emailAdress for backward compatibility
    const emailAddress = req.body.emailAddress || req.body.emailAdress;
    const { password } = req.body;
    
    console.log("🟢 [LOGIN BACKEND] Extracted emailAddress:", emailAddress);
    console.log("🟢 [LOGIN BACKEND] Extracted emailAddress type:", typeof emailAddress);
    console.log("🟢 [LOGIN BACKEND] Extracted emailAddress (JSON):", JSON.stringify(emailAddress));
    
    // Validate required fields
    if (!emailAddress || !password) {
      console.log("❌ [LOGIN BACKEND] Validation failed - missing fields");
      console.log("❌ [LOGIN BACKEND] - emailAddress:", emailAddress ? `provided: "${emailAddress}"` : "MISSING");
      console.log("❌ [LOGIN BACKEND] - password:", password ? "provided" : "MISSING");
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    console.log("🟢 [LOGIN BACKEND] ========== DATABASE QUERY ==========");
    console.log("🟢 [LOGIN BACKEND] Searching for user with email:", emailAddress);
    console.log("🟢 [LOGIN BACKEND] Query value (trimmed):", emailAddress.trim());
    console.log("🟢 [LOGIN BACKEND] Query value (lowercase):", emailAddress.toLowerCase());
    
    // Try multiple field names to find the user
    // First try emailAddress (new schema)
    let user = await User.findOne({ emailAddress });
    console.log("🟢 [LOGIN BACKEND] Search by emailAddress:", user ? "FOUND" : "NOT FOUND");
    
    // If not found, try email (old schema - what's actually in your database)
    if (!user) {
      user = await User.findOne({ email: emailAddress });
      console.log("🟢 [LOGIN BACKEND] Search by email:", user ? "FOUND" : "NOT FOUND");
    }
    
    // If still not found, try emailAdress (typo variant)
    if (!user) {
      user = await User.findOne({ emailAdress: emailAddress });
      console.log("🟢 [LOGIN BACKEND] Search by emailAdress:", user ? "FOUND" : "NOT FOUND");
    }
    
    console.log("🟢 [LOGIN BACKEND] Final query result:", user ? "FOUND USER" : "NO USER FOUND");
    
    // Also try to see all users in database for debugging
    const allUsers = await User.find({}).limit(5);
    console.log("🟢 [LOGIN BACKEND] Sample users in database (first 5):");
    allUsers.forEach((u, index) => {
      const obj = u.toObject();
      console.log(`🟢 [LOGIN BACKEND]   User ${index + 1}:`, {
        _id: obj._id,
        name: obj.name,
        emailAddress: obj.emailAddress,
        email: obj.email,
        emailAdress: obj.emailAdress,
        allKeys: Object.keys(obj).filter(k => !k.startsWith('_') && k !== 'password')
      });
    });

    if (!user) {
      console.log("❌ [LOGIN BACKEND] User not found in database");
      console.log("❌ [LOGIN BACKEND] Searched for:", emailAddress);
      console.log("❌ [LOGIN BACKEND] Tried fields: emailAddress, email, emailAdress");
      
      // Get sample users to show in response for debugging
      const sampleUsers = await User.find({}).limit(3);
      const sampleData = sampleUsers.map(u => {
        const obj = u.toObject();
        return {
          _id: obj._id,
          name: obj.name,
          emailAddress: obj.emailAddress,
          email: obj.email,
          emailAdress: obj.emailAdress,
          allKeys: Object.keys(obj).filter(k => !k.startsWith('_') && k !== 'password')
        };
      });
      
      return res.status(400).json({
        success: false,
        message: 'User not found with the given email!',
        debug: {
          searchedEmail: emailAddress,
          searchedEmailTrimmed: emailAddress.trim(),
          searchedEmailLowercase: emailAddress.toLowerCase(),
          sampleUsersInDB: sampleData,
          totalUsersInDB: await User.countDocuments()
        }
      });
    }

    console.log("✅ [LOGIN BACKEND] ========== USER FOUND ==========");
    const userObj = user.toObject();
    console.log("✅ [LOGIN BACKEND] User document keys:", Object.keys(userObj));
    console.log("✅ [LOGIN BACKEND] User ID:", user._id);
    console.log("✅ [LOGIN BACKEND] User name:", user.name || userObj.fullname);
    
    // Check which email field exists
    const dbEmail = user.emailAddress || user.email || user.emailAdress;
    console.log("✅ [LOGIN BACKEND] User email from DB:", dbEmail);
    console.log("✅ [LOGIN BACKEND] User email field used:", user.emailAddress ? 'emailAddress' : (user.email ? 'email' : 'emailAdress'));
    console.log("✅ [LOGIN BACKEND] Has password:", !!user.password);
    
    // Direct comparison
    console.log("🟢 [LOGIN BACKEND] ========== EMAIL COMPARISON ==========");
    console.log("🟢 [LOGIN BACKEND] Received emailAddress:", emailAddress);
    console.log("🟢 [LOGIN BACKEND] Database email:", dbEmail);
    console.log("🟢 [LOGIN BACKEND] Are they equal:", emailAddress === dbEmail);
    console.log("🟢 [LOGIN BACKEND] Are they equal (case-insensitive):", emailAddress.toLowerCase() === dbEmail.toLowerCase());

    console.log("🟢 [LOGIN BACKEND] Comparing passwords...");
    console.log("🟢 [LOGIN BACKEND] Input password:", password);
    console.log("🟢 [LOGIN BACKEND] Stored password type:", user.password ? (user.password.startsWith('$2') ? 'HASHED' : 'PLAIN TEXT') : 'MISSING');
    console.log("🟢 [LOGIN BACKEND] Stored password length:", user.password ? user.password.length : 0);
    const isMatch = await user.comparePassword(password);
    console.log("🟢 [LOGIN BACKEND] Password comparison result:", isMatch);

    if (!isMatch) {
      console.log("❌ [LOGIN BACKEND] Password does not match");
      return res.status(400).json({
        success: false,
        message: 'Email / password does not match!',
      });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,  
      { expiresIn: "1h" }      
    );

    res.cookie("cp_jwt", token, {
      httpOnly: true,      
      secure: false,       
      sameSite: "lax",     
      path: "/",
      maxAge: 60 * 60 * 1000 
    });


    console.log("✅ [LOGIN BACKEND] Password matches! Creating session...");
    const sessionUserObj = user.toObject();
    delete sessionUserObj.password;
    
    // Normalize email field for session
    if (!sessionUserObj.emailAddress) {
      sessionUserObj.emailAddress = sessionUserObj.email || sessionUserObj.emailAdress;
    }
    
    console.log("✅ [LOGIN BACKEND] User object (without password):", {
      _id: sessionUserObj._id,
      name: sessionUserObj.name || sessionUserObj.fullname,
      emailAddress: sessionUserObj.emailAddress
    });

    req.session.user = sessionUserObj;
    console.log("✅ [LOGIN BACKEND] Session created successfully");
    console.log("✅ [LOGIN BACKEND] Session user:", {
      _id: req.session.user._id,
      name: req.session.user.name || req.session.user.fullname,
      emailAddress: req.session.user.emailAddress
    });

    console.log("✅ [LOGIN BACKEND] ========== Login successful ==========");
    res.json({ success: true, message: 'Sign-in successful', user: sessionUserObj });
  } catch (error) {
    console.error("❌ [LOGIN BACKEND] ========== ERROR ==========");
    console.error('❌ [LOGIN BACKEND] userSignIn error:', error);
    console.error('❌ [LOGIN BACKEND] Error message:', error.message);
    console.error('❌ [LOGIN BACKEND] Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
