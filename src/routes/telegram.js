const express = require("express");

const router = express.Router();

module.exports = (bot) => {
  // Telegram will POST all updates here
  router.post("/", (req, res) => {
    bot.processUpdate(req.body); // Pass the update to the bot
    res.sendStatus(200); // Respond with HTTP 200 status
  });

  router.get("/", (req, res) => {
    console.log('Working');
    res?.send("✅ Telegram Bot API is running");
    
  });

  return router;
};
