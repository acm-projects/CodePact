// services/leetcode.service.js in (CommonJS)
const axios = require("axios");
const { getOrSet } = require("../utils/cacheDB");

const BASE = process.env.LEETCODE_API_BASE || "https://alfa-leetcode-api.onrender.com";

async function fetchJson(path) {
  const url = `${BASE}${path}`;           
  console.log('[leetcode] GET', url);
  try {
    const resp = await axios.get(url, { timeout: 15000 });
    if (resp.data == null || (typeof resp.data === 'string' && !resp.data.trim())) {
      const e = new Error('Upstream empty body');
      e.status = resp.status; e.url = url; e.detail = resp.data;
      throw e;
    }
    return resp.data;
  } catch (err) {
    err.url = url;
    err.status = err?.response?.status || err.status;
    err.detail = err?.response?.data || err.message;
    throw err;
  }
}

// TTLs
const TTL_PROFILE = 60 * 60;  // 1 hour
const TTL_SOLVED  = 10 * 60;  // 10 minutes
const norm = u => String(u || "").trim().toLowerCase();

async function getLeetCodeProfile(username) {
  const key = `profile:${norm(username)}`;
  return getOrSet(key, TTL_PROFILE, async () => {
    const data = await fetchJson(`/userProfile/${encodeURIComponent(username)}`);
    const name = data?.userProfile?.realName || data?.userProfile?.username || username;
    return { raw: data, name };
  });
}

async function getLeetCodeSolved(username) {
  const key = `solved:${norm(username)}`;
  return getOrSet(key, TTL_SOLVED, async () => {
    const data = await fetchJson(`/${encodeURIComponent(username)}/solved`);
    return {
      easy: data?.easySolved ?? data?.easy ?? 0,
      medium: data?.mediumSolved ?? 0,
      hard: data?.hardSolved ?? 0,
    };
  });
}

module.exports = { getLeetCodeProfile, getLeetCodeSolved };
