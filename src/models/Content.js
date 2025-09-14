const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['movie', 'anime', 'series'] },
  description: { type: String },
  files: [{
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
  }],
  // Special command to access this content directly
  accessCommand: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Content", contentSchema);
