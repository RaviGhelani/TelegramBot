const express = require("express");
const {
  createContent,
  getAllContent,
  getContentById,
  getContentByCommand,
  updateContent,
  deleteContent,
  addFileToContent,
  removeFileFromContent
} = require("../controllers/contentController.js");

const router = express.Router();

// Create new content
router.post("/", createContent);

// Get all content with optional filtering and pagination
router.get("/", getAllContent);

// Get content by ID
router.get("/:id", getContentById);

// Get content by access command
router.get("/command/:command", getContentByCommand);

// Update content by ID
router.put("/:id", updateContent);

// Delete content by ID
router.delete("/:id", deleteContent);

// Add file to content
router.post("/:id/files", addFileToContent);

// Remove file from content
router.delete("/:id/files/:fileId", removeFileFromContent);

module.exports = router;