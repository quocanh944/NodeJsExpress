import mongoose from "mongoose";
import config from "./config";

const { database } = config;

const setupDB = async () => {
  try {
    // Connect to MongoDB
    mongoose
      .connect(database)
      .then(() =>
        console.info(`MongoDB Connected to ${database}`)
      )
      .catch(err => console.error(err));
  } catch (error) {
    console.info(`MongoDB failed to connect to ${database}`);
    return null;
  }
};

export { setupDB }
