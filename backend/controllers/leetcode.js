// controllers/leetcode.js
const { getUserStatsSummary } = require('../services/leetcodeService');
const api = require('../api/client');
const { getOrSetJSON } = require('../utils/cacheDB');

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

// normalizes user key (avoid case-sensitive duplicates)
const keyFor = (type, username='') => `${type}:${String(username).trim().toLowerCase()}`;

// chooses sensible TTLs 
const TTL_PROFILE = 60 * 60;     // 1h
const TTL_SOLVED  = 10 * 60;     // 10m
const TTL_STATS   = 10 * 60;     // 10m

async function getProfile(username) {
  const { data } = await api.get(`/userProfile/${encodeURIComponent(username)}`);
  return data;
}
async function getSolved(username) {
  const { data } = await api.get(`/${encodeURIComponent(username)}/solved`);
  return data;
}

async function getStats(req, res) {
  try {
    const username = req.params.username;
    const cacheKey = keyFor('stats', username);

    const result = await getOrSetJSON(cacheKey, TTL_STATS, async () => {
      const [profile, solved] = await Promise.all([
        getOrSetJSON(keyFor('profile', username), TTL_PROFILE, () => getProfile(username)).then(r => r.data),
        getOrSetJSON(keyFor('solved', username),  TTL_SOLVED,  () => getSolved(username)).then(r => r.data),
      ]);
      return { profile, solved };
    });

    res.json({ success: true, cached: result.cached, ...result.data });
  } catch (e) {
    res.status(502).json({
      success: false,
      message: 'LeetCode API error',
      detail: e?.response?.data || e.message
    });
  }
}

module.exports = { getStats };
