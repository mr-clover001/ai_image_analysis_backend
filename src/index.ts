import express, { Application } from "express";
import mongoose from "mongoose";
import imageRoute from "./routes/authRoute.ts";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors"; 
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Application = express();
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not defined.");
}
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(" MongoDB error:", err));


const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Routes for uploading images
app.use("/api", imageRoute);

// Serve uploaded images statically
app.use("/api/upload", express.static(uploadsDir));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});