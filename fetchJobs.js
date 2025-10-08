// fetchJobs.js
const axios = require('axios');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Job = require('./models/Job');

// The URL for the Arbeitnow public API
const API_ENDPOINT = 'https://arbeitnow.com/api/job-board-api';

/**
 * Fetches job data from the Arbeitnow API and saves it to the MongoDB database.
 * Uses an upsert strategy to avoid creating duplicate entries.
 */
const fetchAndSaveJobs = async () => {
  console.log('Starting to fetch job data...');

  try {
    // Make a GET request to the API endpoint
    const response = await axios.get(API_ENDPOINT);
    const jobs = response.data.data; // The jobs are nested in the 'data' property

    if (!jobs || jobs.length === 0) {
      console.log('No jobs found from the API.');
      return;
    }

    console.log(`Fetched ${jobs.length} jobs from the API.`);

    let newJobsCount = 0;
    let updatedJobsCount = 0;

    // Process each job using a for...of loop to handle async operations correctly
    for (const jobData of jobs) {
      // Define the filter to find an existing job by its unique slug
      const filter = { slug: jobData.slug };

      // Map the API data to our Job schema
      const update = {
        title: jobData.title,
        company_name: jobData.company_name,
        description: jobData.description,
        remote: jobData.remote,
        url: jobData.url,
        tags: jobData.tags,
        job_types: jobData.job_types,
        location: jobData.location,
        created_at_source: jobData.created_at
      };

      // Perform an "upsert" operation.
      // If a job with the slug exists, it will be updated.
      // If not, a new job will be inserted.
      const result = await Job.findOneAndUpdate(filter, update, {
        new: true,    // Return the modified document rather than the original
        upsert: true, // Create a new document if no match is found
        runValidators: true // Ensure the update operation adheres to schema validation
      });

      // The 'upserted' property is present on the result if a new document was created
      if (result.upserted) {
        newJobsCount++;
      } else {
        updatedJobsCount++;
      }
    }

    console.log('--- Job Sync Complete ---');
    console.log(`Successfully added ${newJobsCount} new jobs.`);
    console.log(`Successfully updated ${updatedJobsCount} existing jobs.`);

  } catch (error) {
    console.error('An error occurred during the fetch and save process:', error.message);
  }
};

/**
 * Main function to run the ETL process.
 * It connects to the database and then triggers the job fetching process.
 */
const run = async () => {
  await connectDB(); // Establish database connection

  await fetchAndSaveJobs(); // Fetch and save jobs

  // Close the database connection after the script finishes
  await mongoose.disconnect();
  console.log('MongoDB connection closed.');
};

// Execute the main function
run();