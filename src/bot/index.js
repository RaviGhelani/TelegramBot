const TelegramBot = require("node-telegram-bot-api");
const Link = require("../models/Link.js");

const initBot = (token) => {
  const bot = new TelegramBot(token); // no polling

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const links = await Link.find();

    if (links.length === 0) {
      return bot.sendMessage(chatId, "No links are available at the moment.");
    }

    const keyboard = links.map((link) => [{ text: `🔗 ${link.title}`, url: link.url }]);
    bot.sendMessage(chatId, "👋 Welcome! Here are our links:", {
      reply_markup: { inline_keyboard: keyboard },
    });
  });

  return bot;
};

module.exports = { initBot };
