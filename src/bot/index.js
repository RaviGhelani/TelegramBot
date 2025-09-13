import TelegramBot from 'node-telegram-bot-api';
import Link from '../models/Link.js';

export const startBot = (token) => {
  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const links = await Link.find();

    if (links.length === 0) {
      return bot.sendMessage(chatId, "No links are available at the moment.");
    }

    // Build inline keyboard dynamically from DB
    const keyboard = links.map(link => [
      { text: `🔗 ${link.title}`, url: link.url }
    ]);

    bot.sendMessage(chatId, "👋 Welcome! Here are our links:", {
      reply_markup: { inline_keyboard: keyboard }
    });
  });

  return bot;
};
