const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const Image = require("../modal/Image");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Middleware to handle file uploads
// This route handles image uploads and processes them with the LLaVA model
// It expects a file field named "image" in the form data
// The uploaded image is saved to the server, converted to base64, and sent to the LLaVA model for description
router.post("/upload", upload.single("image"), async (req, res) => {
  console.log("Received file:", req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = path.join(__dirname, "../uploads", req.file.filename);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64"); //
    console.log("Base64 image length:", base64Image.length);
    console.log("Looking for file at:", imagePath);

    const llamaResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llava",
        prompt: "Describe the content of this image in one sentence.",
        images: [base64Image],
        stream: false,
      }
    );

    const description = llamaResponse.data.response || "No description";
    console.log("Ollama full response:", llamaResponse.data.response);
    const imageDoc = new Image({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      description,
      uploadDate: new Date(),
    });

    console.log("Saving image document:", imageDoc);
    await imageDoc.save();

    res.status(200).json({
      id: imageDoc._id.toString(),
      fileName: imageDoc.filename,
      uploadedAt: imageDoc.uploadDate.toISOString(),
      description: imageDoc.description,
      status: "completed",
    });
  } catch (err) {
    console.error("Upload failed:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// get all images with json data and metadata with AI generated descriptions
router.get("/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadDate: -1 });

    res.status(200).json(
      images.map((img) => ({
        id: img._id.toString(),
        fileName: img.filename,
        originalName: img.originalname,
        mimeType: img.mimetype,
        size: img.size,
        uploadedAt: img.uploadDate.toISOString(),
        description: img.description,
      }))
    );
  } catch (err) {
    console.error("Failed to fetch images:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get a specific image by ID and delete it
router.delete("/image/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const imageDoc = await Image.findById(id);
    if (!imageDoc) {
      return res.status(404).json({ message: "Image not found" });
    }
    const filePath = path.join(__dirname, "../uploads", imageDoc.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await Image.findByIdAndDelete(id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
