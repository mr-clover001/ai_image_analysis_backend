import express, { Request, Response } from "express";
import upload from "../middleware/uploadMiddleware.ts";
import Image from "../modal/Image.ts";
import axios from "axios";
import fs from "fs";
import path from "path";

const router = express.Router();

// POST /api/upload - Upload and analyze image
router.post("/upload", upload.single("image"), async (req, res) => {
  console.log("Received file:", req.file);

  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const imagePath = path.join(__dirname, "../uploads", req.file.filename);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    console.log("Base64 image length:", base64Image.length);
    console.log("Looking for file at:", imagePath);

    const llamaResponse = await axios.post("http://localhost:11434/api/generate", {
      model: "llava",
      prompt: "Describe the content of this image in one sentence.",
      images: [base64Image],
      stream: false,
    });

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

    await imageDoc.save();
    res.status(200).json({
      id: imageDoc._id.toString(),
      fileName: imageDoc.filename,
      uploadedAt: imageDoc.uploadDate.toISOString(),
      description: imageDoc.description,
      status: "completed",
    });
    return;
  } catch (err: any) {
    console.error("Upload failed:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/images - List all uploaded images
router.get("/images", async (_req: Request, res: Response) => {
  try {
    const images = await Image.find().sort({ uploadDate: -1 });

    res.status(200).json(
      images.map((img: any) => ({
        id: img._id.toString(),
        fileName: img.filename,
        originalName: img.originalname,
        mimeType: img.mimetype,
        size: img.size,
        uploadedAt: img.uploadDate.toISOString(),
        description: img.description,
      }))
    );
  } catch (err: any) {
    console.error("Failed to fetch images:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/image/:id - Delete image by ID
router.delete("/image/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const imageDoc = await Image.findById(id);
    if (!imageDoc) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    const filePath = path.join(__dirname, "../uploads", imageDoc.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Image.findByIdAndDelete(id);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;