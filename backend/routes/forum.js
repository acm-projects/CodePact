const express = require('express');
const router = express.Router();
const ForumThread = require('../models/ForumThread');
const Job = require('../models/Job'); // optional, only if you keep Job model

// DOES NOT IMPLEMENT AUTH - work together to get this done

// Create a thread for a job
// POST /api/forum/thread
// body: { jobCode, companyName, jobId (optional), title, body, authorName, tags? }
router.post('/thread', async (req, res) => {
  try {
    const { jobCode, companyName, jobId, title, body, authorName, tags } = req.body;
    if (!jobCode || !companyName || !title || !body || !authorName) {
      return res.status(400).json({ error: 'jobCode, companyName, title, body, and authorName are required' });
    }

    // Optional: verify jobId or jobCode exists in Job collection
    if (jobId) {
      // If you want to verify the job exists:
      try {
        const jobExists = await Job.findById(jobId).lean();
        if (!jobExists) {
          // if jobId not found, we can still allow thread, but warn
          console.warn(`jobId ${jobId} not found. Creating thread with jobCode only.`);
        }
      } catch (err) {
        console.warn('Job lookup error (non-fatal):', err.message);
      }
    }

    const thread = new ForumThread({
      jobCode: jobCode.toString(),
      jobId: jobId || null,
      companyName,
      title,
      body,
      authorName,
      authorId: null,
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : [])
    });

    await thread.save();
    return res.status(201).json({ message: 'Thread created', thread });
  } catch (err) {
    console.error('Create thread error', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Get threads for a specific job code
// GET /api/forum/job/:jobCode?limit=10&page=1
router.get('/job/:jobCode', async (req, res) => {
  try {
    const { jobCode } = req.params;
    const limit = parseInt(req.query.limit, 10) || 20;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const query = { jobCode: jobCode.toString() };
    const threads = await ForumThread.find(query)
      .sort({ pinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await ForumThread.countDocuments(query);
    return res.json({ count: total, page, limit, threads });
  } catch (err) {
    console.error('Get threads error', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Get a single thread by id
// GET /api/forum/thread/:id
router.get('/thread/:id', async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id).lean();
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    return res.json({ thread });
  } catch (err) {
    console.error('Get thread error', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Add a comment to a thread
// POST /api/forum/thread/:id/comment
// body: { commenterName, text, commenterId? }
router.post('/thread/:id/comment', async (req, res) => {
  try {
    const { commenterName, text, commenterId } = req.body;
    const threadId = req.params.id;
    if (!commenterName || !text) {
      return res.status(400).json({ error: 'commenterName and text are required' });
    }

    const thread = await ForumThread.findById(threadId);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    if (thread.closed) return res.status(403).json({ error: 'Thread is closed' });

    const comment = {
      commenterName,
      commenterId: commenterId || null,
      text
    };

    thread.comments.push(comment);
    thread.updatedAt = new Date();
    await thread.save();

    return res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    console.error('Add comment error', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Simple search across threads by companyName or title
// GET /api/forum/search?q=keyword&limit=10
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    if (!q) return res.status(400).json({ error: 'q query param required' });

    // Basic text-search (case-insensitive)
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const threads = await ForumThread.find({
      $or: [
        { companyName: regex },
        { title: regex },
        { body: regex },
        { 'comments.text': regex }
      ]
    }).limit(limit).lean();

    return res.json({ count: threads.length, threads });
  } catch (err) {
    console.error('Search error', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Admin: pin/unpin or close/open a thread
// POST /api/forum/thread/:id/pin { pinned: true }
router.post('/thread/:id/pin', async (req, res) => {
  try {
    const { pinned } = req.body;
    const thread = await ForumThread.findByIdAndUpdate(req.params.id, { pinned: !!pinned, updatedAt: new Date() }, { new: true });
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    return res.json({ message: 'Updated', thread });
  } catch (err) {
    console.error('Pin error', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

module.exports = router;
