// routes/user.js
const express = require('express');
const { validationResult } = require('express-validator');
const { validateUserSignUp } = require('../middleware/validation/user');
const { createUser, userSignIn } = require('../controllers/user');

const router = express.Router();


function runValidation(req, res, next) {
  const result = validationResult(req);          
  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: result.array(),
    });
  }
  next();
}

router.post('/create-user', validateUserSignUp, runValidation, createUser);
router.post('/sign-in', userSignIn);

module.exports = router;
