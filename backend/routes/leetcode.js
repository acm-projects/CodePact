// routes/leetcode.js
const express = require('express');
const { getLeetCodeProfile, getLeetCodeSolved } = require('../services/leetcode.service');
const router = express.Router();

router.get('/leetcode/health', (_req, res) => res.json({ ok: true, where: 'leetcode' }));

router.get('/leetcode/:username/stats', async (req, res, next) => {
  try {
    const { username } = req.params;
    const [profile, solved] = await Promise.all([
      getLeetCodeProfile(username),
      getLeetCodeSolved(username),
    ]);
    res.json({ success: true, data: { profile, solved } });
  } catch (err) {
    if ((err?.response?.status || 500) === 429) {
      return res.status(429).json({ success: false, message: 'LeetCode API rate limited' });
    }
    next(err);
  }
});

module.exports = router;
