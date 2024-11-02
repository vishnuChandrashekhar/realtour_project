import express from "express";
import config from "config";
import mongoose from "mongoose";
import userRoutes from "./Routes/user.route";
import authRoutes from "./Routes/auth.route";
import listingRoutes from "./Routes/listing.route";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/error.handler";

const mongoURI: string = config.get("database");

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database");
  }
}

connectToDatabase();

const app: express.Application = express();
const PORT: string = config.get("port") as string;

app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/listing", listingRoutes);

// Server function
app.listen(PORT, () => {
  console.log(`Server is running on : http://localhost:${PORT}`);
});
