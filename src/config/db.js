import mongoose from "mongoose";
import config from "./config.js";

const { db_uri } = config;


const setupDB = async () => {
  try {
    // Connect to MongoDB
    mongoose
      .connect(db_uri)
      .then(() =>
        console.info(`MongoDB Connected to ${db_uri}`)
      )
      .catch(err => console.error(err));
  } catch (error) {
    console.info(`MongoDB failed to connect to ${db_uri}`);
    return null;
  }
};

export { setupDB }
