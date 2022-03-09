import ProxyAgent from 'https-proxy-agent';
import TelegramBot from 'node-telegram-bot-api';
import { BOT_TOKEN, PROXY_SERVER, TELEGRAM_PASSWORD } from '../config/config';
import fs from 'fs';

let proxyAgent;
let users: Array<number>

if (PROXY_SERVER) {
    proxyAgent = ProxyAgent(PROXY_SERVER);
}

const telegramBot = new TelegramBot(BOT_TOKEN, {
    polling: true,
    request: {
        url: 'api.telegram.org',
        agent: proxyAgent
    }
});

telegramBot.onText(/\/start/, (msg, match) => {
    telegramBot.sendMessage(msg.chat.id, 'Pls Enter your Password')
});

telegramBot.onText(new RegExp('/\/' + TELEGRAM_PASSWORD + '/'), (msg, match) => {
    const chatId = msg.chat.id
    users.push(chatId)
    users = [...new Set(users)];
    saveUsers();
    console.log('new telegram user registered: ', users)
    telegramBot.sendMessage(chatId, 'Done.')
});

async function saveUsers() {
    fs.writeFile(`./storage/telegram-users.json`, JSON.stringify(users, null, 2), () => { });
}

export default telegramBot;