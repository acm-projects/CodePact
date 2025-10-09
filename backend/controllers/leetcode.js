// controllers/leetcode.js
const { getUserStatsSummary } = require('../services/leetcodeService');

exports.getStats = async (req, res) => {
  try {
    const username = req.params.username.trim();
    if (!username) return res.status(400).json({ success: false, message: 'username required' });

    const data = await getUserStatsSummary(username);
    res.json({ success: true, data });
  } catch (e) {
    res.status(502).json({ success: false, message: 'LeetCode API error', detail: e.message });
  }
};
