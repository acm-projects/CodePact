const Cache = require('../models/Cache');

async function getOrSet(key, ttlSec, fetcher) {
  const now = new Date();
  const hit = await Cache.findOne({ key }).lean();
  if (hit && hit.expiresAt > now) return hit.data;

  const data = await fetcher();
  await Cache.updateOne(
    { key },
    { $set: { data, expiresAt: new Date(Date.now() + ttlSec * 1000) } },
    { upsert: true }
  );
  return data;
}

module.exports = { getOrSet };
