const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const { connectDB } = require("./src/config/db.js");
const adminRoutes = require("./src/routes/admin.js");
const contentRoutes = require("./src/routes/content.js");
const telegramRoutes = require("./src/routes/telegram.js");
const { initBot } = require("./src/bot/index.js");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Initialize the bot
const bot = initBot(
  process.env.BOT_TOKEN,
  process.env.ADMIN_IDS
    ? process.env.ADMIN_IDS.split(",").map((id) => id.trim())
    : []
);

// Define routes
app.use("/admin", adminRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/telegram", telegramRoutes(bot)); // Pass the bot instance to the route

// Root route
app.get("/", (req, res) => res.send("✅ Telegram Bot API is running"));

// Start the server
const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL;

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  try {
    const webhookUrl = `${SERVER_URL}/api/telegram`;
    await bot.setWebHook(webhookUrl);
    console.log("🔗 Webhook set to:", webhookUrl);
  } catch (err) {
    console.error("❌ Failed to set webhook:", err.message);
  }
});

// Export the app for Railway compatibility
module.exports = app;
