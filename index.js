const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const express = require('express');
const pino = require('pino');
const app = express();

const PORT = process.env.PORT || 3000;
const BOT_NAME = "Mominur Bot";
const OWNER = "Mominur";

// Render Alive
app.get('/', (req, res) => res.send(`<h1>${BOT_NAME} is Running ✅</h1>`));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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

    // Pairing Code + Connection
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, pairingCode } = update;
        
        if (pairingCode &&!sock.authState.creds.registered) {
            console.log("\n=====================================");
            console.log(` ${BOT_NAME} - PAIRING CODE`);
            console.log(" Code: " + pairingCode); 
            console.log("=====================================\n");
        }

        if (connection === 'open') {
            console.log(`${BOT_NAME} Connected Successfully ✅`);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode!== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        }
    });

    // Auto Welcome
    sock.ev.on('group-participants.update', async (update) => {
        if (update.action === 'add') {
            for (const user of update.participants) {
                await sock.sendMessage(update.id, { 
                    text: `👋 Welcome @${user.split('@')[0]} to the group!\nI am ${BOT_NAME}`,
                    mentions: [user]
                });
            }
        }
    });

    // All Commands
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        const jid = msg.key.remoteJid;
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").toLowerCase();
        
        if (text === '.ping') {
            const start = Date.now();
            await sock.sendMessage(jid, { text: 'Checking...' });
            const end = Date.now();
            await sock.sendMessage(jid, { text: `🏓 Pong!\nSpeed: ${end - start}ms\nStatus: Online ✅` });
        }

        if (text === '.menu') {
            let menu = `
╭───『 ${BOT_NAME} 』───╮
│ 
│ *📋 AVAILABLE COMMANDS*
│ 
│ *.ping* - Check Bot Speed
│ *.menu* - Show This Menu
│ *.owner* - Owner Information
│ *.runtime* - Bot Uptime
│ 
╰──────────────────╯
*Owner:* ${OWNER}
*Version:* 1.0.0
            `;
            await sock.sendMessage(jid, { text: menu });
        }

        if (text === '.owner') {
            await sock.sendMessage(jid, { 
                text: `
╭───『 OWNER INFO 』───╮
│
│ *Name:* ${OWNER}
│ *Bot:* ${BOT_NAME}
│ *Framework:* Baileys
│
╰───────────────────╯
                `
            });
        }

        if (text === '.runtime') {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            await sock.sendMessage(jid, { text: `⏰ Bot Uptime: ${hours}h ${minutes}m` });
        }
    });
}

startBot();
