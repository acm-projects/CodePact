// backend/controllers/AuthController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    console.log("🟡 [SIGNUP BACKEND] ========== Signup attempt started ==========");
    console.log("🟡 [SIGNUP BACKEND] Request body:", req.body);

    let { name, emailAddress, password } = req.body;

    if (!emailAddress || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    emailAddress = emailAddress.toLowerCase().trim();

    const emailExists = await User.isThisEmailInUse(emailAddress);

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: emailAddress,
      passwordHash,
      fullname: name,
      name,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("cp_jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.fullname,
        emailAddress: user.email,
      },
    });
  } catch (err) {
    console.error("❌ [SIGNUP BACKEND] ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.userSignIn = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    if (!emailAddress || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing credentials" });

    const email = emailAddress.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid login" });

    const valid = await user.comparePassword(password);
    if (!valid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid login" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("cp_jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        emailAddress: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
