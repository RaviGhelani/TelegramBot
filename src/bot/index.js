const TelegramBot = require("node-telegram-bot-api");
const Link = require("../models/Link.js");
const Content = require("../models/Content.js");

const initBot = (token, ADMIN_IDS) => {
  const bot = new TelegramBot(token); // no polling

  bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const accessCommand = match[1] ? match[1].trim() : '';

    // If there's an access command, try to fetch the specific content
    if (accessCommand) {
      try {
        const content = await Content.findOne({ accessCommand });
        
        if (!content) {
          return bot.sendMessage(chatId, "❌ Content not found.");
        }

        // Send content information
        let message = `📺 *${content.title}*\n\n`;
        if (content.description) {
          message += `${content.description}\n\n`;
        }
        message += `Type: ${content.type}\n\n`;
        message += "Available files:\n";

        // Create keyboard with file links
        const keyboard = content.files.map((file) => [
          { text: `📥 ${file.title}`, url: file.fileUrl },
        ]);

        await bot.sendMessage(chatId, message, {
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: keyboard },
        });
        return;
      } catch (error) {
        console.error("Error fetching content:", error);
        return bot.sendMessage(chatId, "❌ An error occurred while fetching the content.");
      }
    }

    // If no access command, show general links
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

  // bot.onText(/\/addlink (.+)/, async (msg, match) => {
  //   const chatId = msg.chat.id;
  //   const userName = msg.chat.username;

  //   // check if user is admin
  //   if (!ADMIN_IDS.includes(userName)) {
  //   console.log(userName, ADMIN_IDS);
    
  //     return bot.sendMessage(
  //       chatId,
  //       "❌ You are not authorized to use this command."
  //     );
  //   }

  //   const text = match[1]; // text after /addlink
  //   // expect format: title | url
  //   const [title, url] = text.split("|").map((t) => t.trim());

  //   if (!title || !url) {
  //     return bot.sendMessage(
  //       chatId,
  //       "❌ Invalid format. Use: /addlink Title | https://link"
  //     );
  //   }

  //   // save to MongoDB
  //   try {
  //     const link = await Link.create({ title, url });
  //     bot.sendMessage(chatId, `✅ Link added: ${link.title}`);
  //   } catch (err) {
  //     console.error(err);
  //     bot.sendMessage(chatId, "❌ Failed to add link.");
  //   }
  // });

  return bot;
};

module.exports = { initBot };
