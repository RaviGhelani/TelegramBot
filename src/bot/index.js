const TelegramBot = require("node-telegram-bot-api");
const Link = require("../models/Link.js");

const initBot = (token, ADMIN_IDS) => {
  const bot = new TelegramBot(token); // no polling

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const links = await Link.find();

    if (links.length === 0) {
      return bot.sendMessage(chatId, "No links are available at the moment.");
    }

    const keyboard = links.map((link) => [
      { text: `🔗 ${link.title}`, url: link.url },
    ]);
    bot.sendMessage(chatId, "👋 Welcome! Here are our links:", {
      reply_markup: { inline_keyboard: keyboard },
    });
  });

  bot.onText(/\/addlink (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userName = msg.chat.username;

    // check if user is admin
    if (!ADMIN_IDS.includes(userName)) {
    console.log(userName, ADMIN_IDS);
    
      return bot.sendMessage(
        chatId,
        "❌ You are not authorized to use this command."
      );
    }

    const text = match[1]; // text after /addlink
    // expect format: title | url
    const [title, url] = text.split("|").map((t) => t.trim());

    if (!title || !url) {
      return bot.sendMessage(
        chatId,
        "❌ Invalid format. Use: /addlink Title | https://link"
      );
    }

    // save to MongoDB
    try {
      const link = await Link.create({ title, url });
      bot.sendMessage(chatId, `✅ Link added: ${link.title}`);
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "❌ Failed to add link.");
    }
  });

  return bot;
};

module.exports = { initBot };
