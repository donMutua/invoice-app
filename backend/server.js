import chalk from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import { connectDB as connectionDB } from "./config/connectDB.js";
import { morganMiddleware, systemLogs } from "./utils/logger.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";

await connectionDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(morganMiddleware);

app.get("/api/v1/test", (req, res) => {
  res.status(200).json({
    message: "Hello world",
  });
});

app.use("/api/v1/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    chalk.green(
      `Server running in ${
        process.env.NODE_ENV
      } mode on port ${PORT} ${chalk.yellow("🚀🚀")}`
    )
  );
  systemLogs.info(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
