// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, default: null },
    name: { type: String, default: null },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// STATIC: check if email exists
userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) return false;
  const existing = await this.findOne({ email: email.toLowerCase().trim() });
  return existing ? true : false;
};

// METHOD: compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
