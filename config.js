// ╔══════════════════════════════════════════════╗
// ║    MOMINUR ISLAM BOT — Main Configuration File        ║
// ║    Owner: MOMINUR ISLAM                      ║
// ║    Number: 8801614160589                     ║
// ║    Email : not configured         ║
// ╚══════════════════════════════════════════════╝
module.exports = {
  BOT_NAME: "MOMINUR ISLAM BOT",
  PREFIX: ".",
  ALLOW_NO_PREFIX: true,        // commands work without prefix too
  REPLY_TO_INBOX: true,         // reply in private chat
  REPLY_TO_SELF: true,          // bot reacts to its own messages
  AUTO_DOWNLOAD_LINKS: true,    // auto downloader on any video link
  AUTO_RESTART: false,
  AUTO_READ: false,
  AUTO_TYPING: false,
  AUTO_UPDATE: true,
  TIMEZONE: "Asia/Dhaka",
  LANGUAGE: "en",
  // ── OWNERS (multi-owner) ──
  OWNERS: [
    "8801614160589",
    "",
    ""
  ],
  OWNER_NAME: "MOMINUR ISLAM",
  OWNER_EMAIL: "",

  // ── LOGIN ──
  loginMode: "qr",              // "qr" | "pair"
  pairingNumber: "6011xxxx",

  // ── AI ──
  AI: {
    enabled: true,
    provider: "lovable",        // lovable | openai | gemini
    model: "google/gemini-2.5-flash",
    personality: "You are MOMINUR ISLAM BOT, a helpful WhatsApp assistant created by MOMINUR ISLAM."
  },

  // ── BRANDING ──
  CREDITS: "All credit — MOMINUR ISLAM",
  FOOTER: "— MOMINUR ISLAM BOT —"
};
