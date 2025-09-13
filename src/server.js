import { connectDB } from "./config/db.js";
import app from "./app.js";
import { startBot } from "./bot/index.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();

  // Start the telegram bot
  startBot(process.env.BOT_TOKEN);

  // Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 Express running on http://localhost:${PORT}`);
  });
})();
