// routes
const express = require('express');
const { createUser } = require('../controllers/user');
const { validateUserSignUp } = require('../middleware/validation/user'); // ← match export
const { validationResult } = require('express-validator');

const router = express.Router();

// collect and return validation errors
function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

router.post('/create-user', validateUserSignUp, runValidation, createUser);

module.exports = router;

/**
 * Route wiring notes:
 * - `validateUserSignUp` is an array of express-validator middlewares exported
 *   from middleware/validation/user.js. The import name here MUST match the export
 *   name; otherwise Express sees `undefined` and throws “argument handler must be a function”.
 * - Each validator chains `.withMessage()` directly to a rule (e.g. `.isLength(...).withMessage(...)`)
 *   so it returns a proper ValidationChain (i.e., a middleware function).
 * - `runValidation` reads validation errors via `validationResult(req)` and short-circuits with a 400
 *   if any exist; otherwise it calls `next()` so `createUser` runs.
 * - `app.use(express.json())` (in app.js) parses JSON bodies so validators and the controller
 *   can access `req.body`. The controller uses the actual inputs (not empty strings), satisfying
 *   Mongoose `required` fields and preventing ValidationErrors.
 */
