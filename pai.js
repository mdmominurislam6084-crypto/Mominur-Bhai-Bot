const axios = require("axios");

module.exports = {
  config: {
    name: "pai",
    aliases: ["ai2"],
    permission: 0,
    prefix: true,
    categorie: "AI Chat",
    cooldowns: 5,
    credit: "Developed by MOMINUR ISLAM BOT", // ক্রেডিট আপডেট করা হয়েছে
    usages: [
      `${global.config.PREFIX}pai <message> - Chat with Pai AI`,
      `${global.config.PREFIX}pai - Get a default reply`,
    ],
    description: "Chat with Pai AI bot powered by MOMINUR ISLAM BOT!",
  },

  start: async function ({ api, event, args }) {
    const { threadId, message, senderId } = event;
    const usermsg = args.join(" ");

    if (!usermsg) {
      return api.sendMessage(
        threadId,
        { text: "হ্যালো! আমি MOMINUR ISLAM BOT-এর AI। দয়া করে আপনার প্রশ্নটি লিখুন।" },
        { quoted: message }
      );
    }

    try {
      const response = await axios.get(
        `https://nayan-ai-online.vercel.app/nayan/pai?number=${senderId.split("@")[0]}&question=${encodeURIComponent(usermsg)}`
      );

      const replyText = response.data?.answer || "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।";
      const finalReply = `${replyText}\n\n_Powered by MOMINUR ISLAM BOT_`;

      const sent = await api.sendMessage(
        threadId,
        { text: finalReply },
        { quoted: message }
      );

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat",
      });
    } catch (err) {
      console.error("❌ MOMINUR ISLAM BOT AI Error:", err);
      return api.sendMessage(
        threadId,
        { text: "❌ দুঃখিত, এআই সার্ভারটি বর্তমানে কাজ করছে না।" },
        { quoted: message }
      );
    }
  },

  handleReply: async function ({ api, event }) {
    const { threadId, message, body, senderId } = event;

    try {
      const response = await axios.get(
        `https://nayan-ai-online.vercel.app/nayan/pai?number=${senderId.split("@")[0]}&question=${encodeURIComponent(body)}`
      );

      const replyText = response.data?.answer || "আমি বুঝতে পারছি না, দয়া করে আবার বলুন।";
      const finalReply = `${replyText}\n\n_Powered by MOMINUR ISLAM BOT_`;

      const sent = await api.sendMessage(
        threadId,
        { text: finalReply },
        { quoted: message }
      );

      global.client.handleReply.push({
        name: "pai",
        author: senderId,
        messageID: sent.key.id,
        type: "chat",
      });
    } catch (err) {
      console.error("❌ MOMINUR ISLAM BOT HandleReply Error:", err);
      return api.sendMessage(
        threadId,
        { text: "❌ এআই রেসপন্স পেতে সমস্যা হচ্ছে।" },
        { quoted: message }
      );
    }
  },
};
