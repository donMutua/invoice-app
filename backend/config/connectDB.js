import chalk from "chalk";
import mongoose from "mongoose";
import { systemLogs } from "../utils/logger.js";

export const connectDB = async () => {
  try {
    const connectionParams = {
      dbName: process.env.DB_NAME,
    };

    const connect = await mongoose.connect(
      process.env.MONGO_URI,
      connectionParams
    );

    console.log(
      `${chalk.cyanBright.bold(
        `MongoDB Connected: ${connect.connection.host}`
      )}`
    );
    systemLogs.info(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(chalk.red.bold(`Error: ${error.message}`));
    process.exit(1);
  }
};
