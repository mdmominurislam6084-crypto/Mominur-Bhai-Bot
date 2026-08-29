const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const config = require('./config.js')
const pino = require('pino')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' })
    })

    sock.ev.on('creds.update', saveCreds)
    
    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0]
        if (!msg.message) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text
        if (text && text.startsWith(config.prefix)) {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Bot online boss 🔥' })
        }
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode!== DisconnectReason.loggedOut
            if(shouldReconnect) startBot()
        } else if(connection === 'open') {
            console.log('Bot connected successfully')
        }
    })
}
startBot() 
    const express = require('express')
const app = express()
app.listen(process.env.PORT || 3000, () => console.log('Server running on port', process.env.PORT))
