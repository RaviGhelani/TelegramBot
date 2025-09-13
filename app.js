import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import adminRoutes from "./src/routes/admin.js";
import { startBot } from "./src/bot/index.js";

dotenv.config();

const app = express();
app.use(express.json());

// 1️⃣ connect to MongoDB
connectDB();

// 2️⃣ start Telegram bot (polling)
startBot(process.env.BOT_TOKEN);

// 3️⃣ admin API routes
app.use("/admin", adminRoutes);

// 4️⃣ basic health check
app.get("/", (req, res) => {
  res.send("✅ Telegram Bot API is running");
});

// 5️⃣ start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
