// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Retrieve the MongoDB connection string from environment variables
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('MongoDB URI not found in.env file.');
      process.exit(1); // Exit the process with a failure code
    }

    // Attempt to connect to the MongoDB database
    await mongoose.connect(mongoURI);

    console.log('MongoDB Connected Successfully.');
  } catch (error) {
    // Log any errors that occur during the connection attempt
    console.error('Error connecting to MongoDB:', error.message);
    // Exit the process with a failure code to prevent the app from running without a DB connection
    process.exit(1);
  }
};

module.exports = connectDB;