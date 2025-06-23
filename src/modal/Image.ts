import mongoose from "mongoose";

// Define the Mongoose schema
const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  description: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

// Create and export the model
const Image = mongoose.model("Image", imageSchema);
export default Image;
