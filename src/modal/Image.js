const mongoose = require("mongoose");

// Define the schema for the Image model as per the requirements
// This schema includes fields for the filename, original name, MIME type, size, description, and upload date
const imageSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  description: String,
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Image", imageSchema);

// AI Api generating the description
// This model will be used to interact with the MongoDB database for storing image metadata
// The schema includes fields for the filename, original name, MIME type, size, description, and upload date
// The description field will be populated with the AI-generated description of the image
