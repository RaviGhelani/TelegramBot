const express = require("express");
const Link = require("../models/Link.js");

const router = express.Router();

// Add a new link
router.post("/link", async (req, res) => {
  try {
    const { title, url } = req.body;
    const newLink = await Link.create({ title, url });
    res.json(newLink);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ error: "Failed to create link" });
  }
});

// Get all links
router.get("/link", async (_req, res) => {
  try {
    const links = await Link.find();
    res.json(links);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ error: "Failed to fetch links" });
  }
});

module.exports = router;
