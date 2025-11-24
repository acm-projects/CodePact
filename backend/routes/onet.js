const express = require('express');
const axios = require('axios');
const Job = require('../models/Job');
const router = express.Router();

const ONET_USER = process.env.ONET_USERNAME;
const ONET_PASS = process.env.ONET_PASSWORD;

// Keywords to identify IT / Software / CS related occupations
const TECH_KEYWORDS = [
  'software',
  'computer',
  'it',
  'information',
  'technology',
  'developer',
  'programmer',
  'engineer',
  'analyst',
  'cyber',
  'data',
  'network',
  'security'
];

//Fetch O*NET occupations and store IT-related ones
router.get('/fetch', async (req, res) => {
  try {
    console.log('Fetching from O*NET API...');
    const response = await axios.get(
      'https://services.onetcenter.org/ws/online/occupations/?format=json',
      {
        auth: { username: ONET_USER, password: ONET_PASS },
        params: { start: 0, end: 200 } // first 200 occupations
      }
    );

    const occupations = response.data.occupation || response.data || [];
    const techJobs = [];

    for (const occ of occupations) {
      const title = occ.title?.toLowerCase() || '';
      const desc = occ.description?.toLowerCase() || '';

      // Filter for IT/software related roles
      const matchesKeyword = TECH_KEYWORDS.some(k => title.includes(k) || desc.includes(k));

      if (matchesKeyword) {
        techJobs.push({
          title: occ.title,
          code: occ.code,
          category: occ.category || 'Technology',
          description: occ.description || '',
          skills: [],
          techField: true
        });
      }
    }

    if (!techJobs.length) {
      return res.status(404).json({ message: 'No tech-related jobs found.' });
    }

    // Save to MongoDB (upsert to avoid duplicates)
    for (const job of techJobs) {
      await Job.findOneAndUpdate(
        { code: job.code },
        job,
        { upsert: true, new: true }
      );
    }

    res.json({
      message: `Saved ${techJobs.length} tech-related occupations.`,
      jobs: techJobs
    });

  } catch (err) {
    console.error('Error fetching from O*NET:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;