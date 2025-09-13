// const { initBot } = require("../src/bot/index.js");

// const bot = initBot(
//   process.env.BOT_TOKEN,
//   process.env.ADMIN_IDS
//     ? process.env.ADMIN_IDS.split(",").map((id) => id.trim())
//     : []
// );

// const setWebhook = async () => {
//   const webhookUrl = `${process.env.SERVER_URL}/api/telegram`;
//   await bot.setWebHook(webhookUrl);
//   console.log("🔗 Webhook set to:", webhookUrl);
// };

// setWebhook(); // Set the webhook when the function is initialized

// module.exports = async (req, res) => {
//   if (req.method === "POST") {
//     console.log("Received update:", req.body); // Log the incoming update
//     bot.processUpdate(req.body); // Pass the update to the bot
//     res.status(200).send("OK");
//   } else {
//     res.status(405).send("Method Not Allowed");
//   }
// };

// api/telegram.js
const serverless = require("@vendia/serverless-express");
const { app } = require("../app");

module.exports = serverless({ app });
