require('dotenv').config();
const mongoose = require('mongoose');

const dbURI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/test'

const setupDB = async () => {
  try {
    // Connect to MongoDB
    mongoose
      .connect(dbURI)
      .then(() =>
        console.info(`MongoDB Connected to ${dbURI}`)
      )
      .catch(err => console.error(err));
  } catch (error) {
    console.info(`MongoDB failed to connect to ${dbURI}`);
    return null;
  }
};

module.exports = setupDB;