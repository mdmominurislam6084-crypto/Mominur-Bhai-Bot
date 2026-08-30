const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const pino = require('pino');
const app = express();

const PORT = process.env.PORT || 3000;
const BOT_NAME = "Mominur Bot";  
const OWNER = "Mominur";         
const PREFIX = ".";
const PHONE_NUMBER = process.env.PHONE_NUMBER; 

// Keep Alive for Render
app.get('/', (req, res) => res.send(`<h1>◈ ${BOT_NAME} is Running ◈</h1>`));
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: [BOT_NAME, 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    // ========== PAIRING CODE - FULL EMON DESIGN ==========
    if (!sock.authState.creds.registered) {
        if (!PHONE_NUMBER) {
            console.log(`
◈━━━━━━━━━━━━━━━━━━❍
◈│  ❌ ERROR
◈│  PHONE_NUMBER Env set koro
◈╰━━━━━━━━━━❍`);
        } else {
            setTimeout(async () => {
                try {
                    const code = await sock.requestPairingCode(PHONE_NUMBER);
                    console.log(`
◈━━━━━━━━━━━━━━━━━━━━━━━❍
◈│                          
◈│     *${BOT_NAME}*
◈│     *PAIRING CODE GENERATOR* 🔑
◈│                          
◈├━━━━━━━━━━━━━━━❍
◈│  📱 Number : *${PHONE_NUMBER}*
◈│  🔐 Code   : *${code}*
◈│  👑 Owner  : *${OWNER}*
◈│  ⚡ Prefix : *${PREFIX}*
◈├━━━━━━━━━━━━━━━❍
◈│  📲 WhatsApp > 3 Dot > Linked Devices
◈│  🔗 Link with phone number
◈╰━━━━━━━━━━━━━━━❍
`);
                } catch (err) {
                    console.log("❌ Pairing Code Error:", err);
                }
            }, 3000);
        }
    }

    // ========== CONNECTION ==========
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            console.log(`
◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━❍
◈│  ✅ *${BOT_NAME} CONNECTED*
◈│  👑 Owner: ${OWNER}
◈│  📦 Plugins: 277 Loaded
◈╰━━━━━━━━━━━━━━━❍
`);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('⚠️ Connection closed, reconnecting...');
            if (shouldReconnect) startBot();
        }
    });

    // ========== MESSAGE HANDLER ==========
    sock.ev.on('messages.upsert', async (m) => {
        // এখানে তোমার 277 টা plugin handler থাকবে
    });

    // ========== GROUP EVENTS ==========
    sock.ev.on('group-participants.update', async (update) => {
        if (update.action === 'add') {
            // Welcome logic
        }
    });
}

startBot();
