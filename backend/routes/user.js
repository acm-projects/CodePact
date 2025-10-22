// routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

const signUpValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').optional().isString().isLength({ max: 80 })
];
const signInValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString()
];
const runValidation = (req, res, next) => {
  const r = validationResult(req);
  if (!r.isEmpty()) return res.status(400).json({ success: false, errors: r.array() });
  next();
};

const makeToken = (user) => {
  const sec = process.env.JWT_SECRET;
  if (!sec) throw new Error('JWT_SECRET missing');
  return jwt.sign({ id: user._id.toString(), email: user.email }, sec, { expiresIn: '7d' });
};

router.get('/user/health', (_req, res) => res.json({ ok: true }));

router.post('/create-user', signUpValidation, runValidation, async (req, res, next) => {
  try {
    const { email, password, name, fullname } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, errors: [{ msg: 'Email already in use', param: 'email' }] });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });
    const token = makeToken(user);
    res.status(201).json({ success: true, user: { id: user._id, email, name: user.name || null }, token });
  } catch (e) { next(e); }
});

router.post('/sign-in', signInValidation, runValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user || !user.passwordHash) {
      return res.status(400).json({ success: false, errors: [{ msg: 'Invalid email or password', param: 'email' }] });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ success: false, errors: [{ msg: 'Invalid email or password', param: 'password' }] });
    const token = makeToken(user);
    res.json({ success: true, token, user: { id: user._id, email: user.email, name: user.name || null } });
  } catch (e) { next(e); }
});

module.exports = router;
