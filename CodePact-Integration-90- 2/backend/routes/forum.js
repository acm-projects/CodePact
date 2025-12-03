const express = require('express');
const router = express.Router();
const ForumThread = require('../models/ForumThread');
const Job = require('../models/Job');
const cors = require('cors');

// Allow frontend (React) to make requests
router.use(cors({ origin: 'http://localhost:8000', credentials: true }));

// ✅ Create a thread
// POST /api/forum/threads
router.post('/threads', async (req, res) => {
  try {
    const { jobCode, companyName, title, body, authorName, tags } = req.body;

    if (!jobCode || !companyName || !title || !body || !authorName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingThread = await ForumThread.findOne({ jobCode, title });
    if (existingThread) {
      return res.status(409).json({ error: 'Thread already exists' });
    }

    const thread = new ForumThread({
      jobCode,
      companyName,
      title,
      body,
      authorName,
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
    });

    await thread.save();
    res.status(201).json(thread);
  } catch (err) {
    console.error('Create thread error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get all threads (for Public Forum home)
router.get('/threads', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const threads = await ForumThread.find({})
      .sort({ pinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await ForumThread.countDocuments({});
    res.json({ count: total, page, limit, threads });
  } catch (err) {
    console.error('Get all threads error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get threads by job code
router.get('/job/:jobCode', async (req, res) => {
  try {
    const threads = await ForumThread.find({ jobCode: req.params.jobCode })
      .sort({ pinned: -1, createdAt: -1 })
      .lean();
    res.json(threads);
  } catch (err) {
    console.error('Get job threads error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get single thread by id
router.get('/thread/:id', async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id).lean();
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    res.json(thread);
  } catch (err) {
    console.error('Get thread error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Add comment to a thread
router.post('/thread/:id/comment', async (req, res) => {
  try {
    const { commenterName, text, commenterId } = req.body;
    if (!commenterName || !text)
      return res.status(400).json({ error: 'commenterName and text are required' });

    const thread = await ForumThread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    thread.comments.push({
      commenterName,
      commenterId: commenterId || null,
      text,
    });

    await thread.save();
    res.status(201).json({ message: 'Comment added', comments: thread.comments });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;