// routes/leetcode.js (CommonJS)
const express = require("express");
const { getLeetCodeProfile, getLeetCodeSolved } = require("../services/leetcode.service");

const router = express.Router();

router.get("/leetcode/:username/stats", async (req, res, next) => {
  try {
    const { username } = req.params;
    const [profile, solved] = await Promise.all([
      getLeetCodeProfile(username),
      getLeetCodeSolved(username),
    ]);

    res.json({ success: true, data: { profile, solved } });
  } catch (err) {
    const status = err?.response?.status || 500;
    const detail = err?.response?.data || err?.message || "Unknown error";
    if (status === 429) {
      return res.status(429).json({ success: false, message: "LeetCode API rate limited", detail });
    }
    next(err);
  }
});

module.exports = router;
