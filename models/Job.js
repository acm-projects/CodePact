// models/Job.js
const mongoose = require('mongoose');

// Define the schema for the Job collection
const jobSchema = new mongoose.Schema({
  // Unique identifier from the source API, used for preventing duplicates
  slug: {
    type: String,
    required: [true, 'A job must have a slug.'],
    unique: true,
    index: true // Index for faster queries
  },
  // The title of the job posting
  title: {
    type: String,
    required: [true, 'A job must have a title.']
  },
  // The name of the company offering the job
  company_name: {
    type: String,
    required: [true, 'A job must have a company name.']
  },
  // The full job description, often containing HTML content
  description: {
    type: String,
    required: false
  },
  // Boolean flag indicating if the job is remote
  remote: {
    type: Boolean,
    required: false
  },
  // The direct URL to the job application or full posting
  url: {
    type: String,
    required: false
  },
  // An array of tags associated with the job (e.g., 'tech', 'full-time')
  tags: {
    type: Array,
    default: false
  },
  // An array of job types (e.g., 'permanent', 'contract')
  job_types: {
    type: Array,
    default: false
  },
  // The geographical location of the job
  location: {
    type: String,
    required: [true, 'A job must have a location.']
  },
  // The original creation timestamp from the API source
  created_at_source: {
    type: Number,
    required: true
  }
}, {
  // Mongoose option to automatically add createdAt and updatedAt fields
  timestamps: true
});

// Create the Mongoose model from the schema
const Job = mongoose.model('Job', jobSchema);

// Export the model to be used in other parts of the application
module.exports = Job;
