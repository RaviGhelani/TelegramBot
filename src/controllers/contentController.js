const Content = require("../models/Content.js");

// Create a new content
const createContent = async (req, res) => {
  try {
    const { title, type, description, files, accessCommand } = req.body;
    
    // Validate required fields
    if (!title || !type) {
      return res.status(400).json({ 
        error: "Title and type are required fields" 
      });
    }

    // Validate type enum
    if (!['movie', 'anime', 'series'].includes(type)) {
      return res.status(400).json({ 
        error: "Type must be one of: movie, anime, series" 
      });
    }

    // Validate files array if provided
    if (files && Array.isArray(files)) {
      for (const file of files) {
        if (!file.title || !file.fileUrl) {
          return res.status(400).json({ 
            error: "Each file must have title and fileUrl" 
          });
        }
      }
    }

    const newContent = await Content.create({
      title,
      type,
      description,
      files: files || [],
      accessCommand
    });

    res.status(201).json({
      success: true,
      data: newContent
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "Access command must be unique" 
      });
    }
    // console.error("Create content error:", err);
    res.status(500).json({ 
      error: "Failed to create content" 
    });
  }
};

// Get all content with optional filtering
const getAllContent = async (req, res) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (type && ['movie', 'anime', 'series'].includes(type)) {
      filter.type = type;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const content = await Content.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Content.countDocuments(filter);

    res.json({
      success: true,
      data: content,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    // console.error("Get all content error:", err);
    res.status(500).json({ 
      error: "Failed to fetch content" 
    });
  }
};

// Get content by ID
const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await Content.findById(id);
    
    if (!content) {
      return res.status(404).json({ 
        error: "Content not found" 
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (err) {
    // console.error("Get content by ID error:", err);
    res.status(500).json({ 
      error: "Failed to fetch content" 
    });
  }
};

// Get content by access command
const getContentByCommand = async (req, res) => {
  try {
    const { command } = req.params;
    
    const content = await Content.findOne({ accessCommand: command });
    
    if (!content) {
      return res.status(404).json({ 
        error: "Content not found" 
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (err) {
    // console.error("Get content by command error:", err);
    res.status(500).json({ 
      error: "Failed to fetch content" 
    });
  }
};

// Update content by ID
const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description, files, accessCommand } = req.body;
    
    // Validate type if provided
    if (type && !['movie', 'anime', 'series'].includes(type)) {
      return res.status(400).json({ 
        error: "Type must be one of: movie, anime, series" 
      });
    }

    // Validate files array if provided
    if (files && Array.isArray(files)) {
      for (const file of files) {
        if (!file.title || !file.fileUrl) {
          return res.status(400).json({ 
            error: "Each file must have title and fileUrl" 
          });
        }
      }
    }

    const updatedContent = await Content.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(type && { type }),
        ...(description !== undefined && { description }),
        ...(files && { files }),
        ...(accessCommand !== undefined && { accessCommand })
      },
      { new: true, runValidators: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ 
        error: "Content not found" 
      });
    }

    res.json({
      success: true,
      data: updatedContent
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "Access command must be unique" 
      });
    }
    // console.error("Update content error:", err);
    res.status(500).json({ 
      error: "Failed to update content" 
    });
  }
};

// Delete content by ID
const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedContent = await Content.findByIdAndDelete(id);
    
    if (!deletedContent) {
      return res.status(404).json({ 
        error: "Content not found" 
      });
    }

    res.json({
      success: true,
      message: "Content deleted successfully",
      data: deletedContent
    });
  } catch (err) {
    // console.error("Delete content error:", err);
    res.status(500).json({ 
      error: "Failed to delete content" 
    });
  }
};

// Add file to content
const addFileToContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, fileUrl } = req.body;
    
    if (!title || !fileUrl) {
      return res.status(400).json({ 
        error: "Title and fileUrl are required" 
      });
    }

    const content = await Content.findById(id);
    
    if (!content) {
      return res.status(404).json({ 
        error: "Content not found" 
      });
    }

    content.files.push({ title, fileUrl });
    await content.save();

    res.json({
      success: true,
      data: content
    });
  } catch (err) {
    // console.error("Add file to content error:", err);
    res.status(500).json({ 
      error: "Failed to add file to content" 
    });
  }
};

// Remove file from content
const removeFileFromContent = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    
    const content = await Content.findById(id);
    
    if (!content) {
      return res.status(404).json({ 
        error: "Content not found" 
      });
    }

    const fileIndex = content.files.findIndex(file => file._id.toString() === fileId);
    
    if (fileIndex === -1) {
      return res.status(404).json({ 
        error: "File not found" 
      });
    }

    content.files.splice(fileIndex, 1);
    await content.save();

    res.json({
      success: true,
      data: content
    });
  } catch (err) {
    // console.error("Remove file from content error:", err);
    res.status(500).json({ 
      error: "Failed to remove file from content" 
    });
  }
};

module.exports = {
  createContent,
  getAllContent,
  getContentById,
  getContentByCommand,
  updateContent,
  deleteContent,
  addFileToContent,
  removeFileFromContent
};