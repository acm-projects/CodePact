// services/leetcode.service.js (CommonJS)
const axios = require("axios");

const BASE = process.env.LEETCODE_API_BASE || "https://alfa-leetcode-api.onrender.com";

async function getLeetCodeProfile(username) {
  const url = `${BASE}/userProfile/${encodeURIComponent(username)}`;
  const { data } = await axios.get(url);
  const name = data?.userProfile?.realName || data?.userProfile?.username || username;
  return { raw: data, name };
}

async function getLeetCodeSolved(username) {
  const url = `${BASE}/${encodeURIComponent(username)}/solved`;
  const { data } = await axios.get(url);
  return {
    easy: data?.easySolved ?? data?.easy ?? 0,
    medium: data?.mediumSolved ?? 0,
    hard: data?.hardSolved ?? 0,
  };
}

module.exports = { getLeetCodeProfile, getLeetCodeSolved };
