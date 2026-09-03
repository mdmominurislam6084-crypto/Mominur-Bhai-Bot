module.exports = {
  config: { name: "gentleman", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "🎩 Gentleman rate generator.", credit: "MOMINUR ISLAM" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "🎩 Gentleman rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
