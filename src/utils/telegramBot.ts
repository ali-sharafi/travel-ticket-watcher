import ProxyAgent from 'https-proxy-agent';
import TelegramBot from 'node-telegram-bot-api';
import { BOT_TOKEN, PROXY_SERVER, TELEGRAM_PASSWORD } from '../config/config';
import fs from 'fs';
import logger from './logger';

let proxyAgent;
var users: Array<number> = [];
let telegramBot: TelegramBot | undefined;

if (PROXY_SERVER) {
    proxyAgent = ProxyAgent(PROXY_SERVER);
}

if (BOT_TOKEN) {
    telegramBot = new TelegramBot(BOT_TOKEN, {
        polling: true,
        request: {
            url: 'api.telegram.org',
            agent: proxyAgent
        }
    });

    telegramBot.onText(/\/start/, (msg, match) => {
        if (telegramBot)
            telegramBot.sendMessage(msg.chat.id, 'Pls Enter your Password')
    });

    telegramBot.onText(new RegExp(TELEGRAM_PASSWORD), (msg, match) => {
        const chatId = msg.chat.id
        users.push(chatId)
        users = [...new Set(users)];
        saveUsers();
        console.log('new telegram user registered: ', users)
        if (telegramBot)
            telegramBot.sendMessage(chatId, 'Done.')
    });
}

async function saveUsers() {
    fs.writeFile(`${__dirname}/../storage/telegram-users.json`, JSON.stringify(users, null, 2), (err) => {
        if (err) logger('Some error occured while save new users: ' + err.message)
    });
}

export default telegramBot;