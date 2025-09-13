// const express = require("express");
// const dotenv = require("dotenv");
// dotenv.config();
// const { connectDB } = require("./src/config/db.js");
// const adminRoutes = require("./src/routes/admin.js");
// const telegramRoutes = require("./src/routes/telegram.js");
// const { initBot } = require("./src/bot/index.js");

// const app = express();
// app.use(express.json());

// connectDB();
// const bot = initBot(
//   process.env.BOT_TOKEN,
//   process.env.ADMIN_IDS
//     ? process.env.ADMIN_IDS.split(",").map((id) => id.trim())
//     : []
// ); // Initialize the bot here

// app.use("/admin", adminRoutes);
// app.use("/api/telegram", telegramRoutes(bot)); // Pass the bot instance to the route

// app.get("/", (req, res) => res.send("✅ Telegram Bot API is running"));

// const PORT = process.env.PORT || 3000;
// const SERVER_URL = process.env.SERVER_URL || 3000;

// app.listen(PORT, async () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);

//   const webhookUrl = `${SERVER_URL}/api/telegram`;
//   await bot.setWebHook(webhookUrl);
//   console.log("🔗 Webhook set to:", webhookUrl);
// });


// src/server/app.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./src/config/db.js");
const adminRoutes = require("./src/routes/admin.js");
const telegramRoutes = require("./src/routes/telegram.js");
const { initBot } = require("./src/bot/index.js");

connectDB();

// ✅ Create bot once (not inside handler)
const bot = initBot(
  process.env.BOT_TOKEN,
  process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(",").map(id => id.trim()) : []
);

const app = express();
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/api/telegram", telegramRoutes(bot));

app.get("/", (req, res) => res.send("✅ Telegram Bot API is running"));

// ✅ Export app & bot (no app.listen)
module.exports = { app, bot };

