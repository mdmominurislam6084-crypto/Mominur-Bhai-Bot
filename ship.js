module.exports = {
  config: { name: "ship", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "💘 Love score generator.", credit: "MOMINUR ISLAM" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "💘 Love score: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
