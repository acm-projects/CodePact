const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const ADZUNA_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_KEY = process.env.ADZUNA_APP_KEY;
 
// GET /api/adzuna/search
router.get('/search', async (req, res) => {
  try {
    const { keyword = 'software engineer', location = 'United States' } = req.query;

    console.log(`Fetching Adzuna jobs for "${keyword}" in "${location}"...`);

    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/us/search/1`;

    const response = await axios.get(adzunaUrl, {
      params: {
        app_id: ADZUNA_ID,
        app_key: ADZUNA_KEY,
        what: keyword,
        where: location,
        results_per_page: 20,
      },
    headers: {
        Accept: 'application/json',
  },
    });

    const jobResults = response.data.results || [];

    if (!jobResults.length) {
      return res.status(404).json({ message: 'No live jobs found.' });
    }

    // Format and return results
    const formatted = jobResults.map(job => ({
      title: job.title,
      company: job.company?.display_name,
      location: job.location?.display_name,
      description: job.description,
      category: job.category?.label,
      salary: job.salary_max || job.salary_min || null,
      url: job.redirect_url,
      created: job.created
    }));

    res.json({
      message: `Found ${formatted.length} live job listings.`,
      results: formatted
    });

  } catch (err) {
    console.error('Adzuna API error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;