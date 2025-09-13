const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { connectDB } = require("./src/config/db.js");
const adminRoutes = require("./src/routes/admin.js");
const telegramRoutes = require("./src/routes/telegram.js");
const { initBot } = require("./src/bot/index.js");

const app = express();
app.use(express.json());

connectDB();
const bot = initBot(process.env.BOT_TOKEN); // Initialize the bot here

app.use("/admin", adminRoutes);
app.use("/api/telegram", telegramRoutes(bot)); // Pass the bot instance to the route

app.get("/", (req, res) => res.send("✅ Telegram Bot API is running"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  const webhookUrl = `https://cp3tcrsh-8000.inc1.devtunnels.ms/api/telegram`;
  await bot.setWebHook(webhookUrl);
  console.log("🔗 Webhook set to:", webhookUrl);
});
