const { check } = require('express-validator');

exports.validateUserSignUp = [
  check('fullname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required')
    .not()
    .isString()
    .withMessage('Must be a valid name!')
    .isLength({ min: 3, max: 20 })
    .withMessage('Name must be within 3 to 20 characters!'),

  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email!'),

  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is empty!')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be 8 to 20 characters long!'),

  check('confirmPassword')
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Both passwords must be the same!');
      }
      return true;
    }),
];


exports.userValidation = (req, res, next) => {
    const result = validationResult(req).array();
    console.log(result);


    const error = result[0].msg;
    res.json({success: false, message: error })
}