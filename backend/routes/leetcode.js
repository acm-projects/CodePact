// routes/leetcode.js
const express = require('express');
const { getStats } = require('../controllers/leetcode');
const router = express.Router();

router.get('/leetcode/:username/stats', getStats);

module.exports = router; // Exporting the router 
