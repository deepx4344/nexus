import mongoose from "mongoose";
import processConfig from "./env.js";
import { logger } from "./logger.js";
const connectDB = async () => {
  try {
    const MONGODBURI: string = processConfig.DATABASEURI!;
    await mongoose.connect(MONGODBURI);
    logger.info("MongoDB connected successfully");
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(`MongoDB connection error ${err}`);
      process.exit(1);
    } else {
      logger.error("MongoDB connection error");
      process.exit(1);
    }
  }
};

export default connectDB;
