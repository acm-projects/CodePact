// backend/routes/forum.js
const express = require('express');
const router = express.Router();
const ForumThread = require('../models/ForumThread');

// Create thread
// POST /api/forum/threads
router.post('/threads', async (req, res) => {
  try {
    const { jobCode, companyName, title, body, authorName, tags } = req.body;

    if (!jobCode || !companyName || !title || !body || !authorName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // optional: normalize jobCode
    const jcode = jobCode.toString();

    const existing = await ForumThread.findOne({ jobCode: jcode, title }).lean();
    if (existing) return res.status(409).json({ error: 'Thread already exists' });

    const thread = new ForumThread({
      jobCode: jcode,
      companyName,
      title,
      body,
      authorName,
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : [])
    });

    await thread.save();
    return res.status(201).json({ thread });
  } catch (err) {
    console.error('Create thread error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get latest threads (public feed)
// GET /api/forum/threads?limit=20&page=1
router.get('/threads', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const threads = await ForumThread.find({})
      .sort({ pinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await ForumThread.countDocuments({});
    return res.json({ count: total, page, limit, threads });
  } catch (err) {
    console.error('Get all threads error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get threads by jobCode
// GET /api/forum/job/:jobCode
router.get('/job/:jobCode', async (req, res) => {
  try {
    const jobCode = req.params.jobCode;
    const threads = await ForumThread.find({ jobCode }).sort({ pinned: -1, createdAt: -1 }).lean();
    return res.json({ threads });
  } catch (err) {
    console.error('Get job threads error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single thread
// GET /api/forum/thread/:id
router.get('/thread/:id', async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id).lean();
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    return res.json({ thread });
  } catch (err) {
    console.error('Get thread error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add comment
// POST /api/forum/thread/:id/comment
router.post('/thread/:id/comment', async (req, res) => {
  try {
    const { commenterName, text, commenterId } = req.body;
    if (!commenterName || !text) return res.status(400).json({ error: 'commenterName and text are required' });

    const thread = await ForumThread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    if (thread.closed) return res.status(403).json({ error: 'Thread is closed' });

    thread.comments.push({
      commenterName,
      commenterId: commenterId || null,
      text
    });

    thread.updatedAt = new Date();
    await thread.save();
    return res.status(201).json({ message: 'Comment added', comments: thread.comments });
  } catch (err) {
    console.error('Add comment error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
