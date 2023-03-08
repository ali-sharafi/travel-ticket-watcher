const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs/promises');
const Travel = require('../models/Travel');
const logger = require('./logger');

var users = [];
let telegramBot;
const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_PASSWORD = process.env.TELEGRAM_PASSWORD;

if (BOT_TOKEN) {
    telegramBot = new TelegramBot(BOT_TOKEN, {
        polling: true,
        request: {
            url: 'api.telegram.org',
        }
    });

    telegramBot.onText(/\/start/, (msg, match) => {
        if (telegramBot)
            telegramBot.sendMessage(msg.chat.id, 'Pls Enter your Password')
    });

    telegramBot.onText(new RegExp(TELEGRAM_PASSWORD), async (msg, match) => {
        const chatId = msg.chat.id
        await readUsers();
        users.push(chatId)
        users = [...new Set(users)];
        await saveUsers();
        console.log('new telegram user registered: ', users)
        if (telegramBot)
            telegramBot.sendMessage(chatId, 'Done.')
    });

    telegramBot.on('callback_query', function onCallbackQuery(callbackQuery) {
        const action = callbackQuery.data.split('|');
        const travelId = action[1];
        Travel.findByIdAndUpdate(travelId, { is_completed: true }).then(res => {
            logger(`Travel completed successfully res:${res}`)
        })
    });
}

async function readUsers() {
    let data = await fs.readFile(`${__dirname}/../../storage/telegram-users.json`, 'utf-8');
    users = JSON.parse(data);
}

async function saveUsers() {
    try {
        await fs.writeFile(`${__dirname}/../../storage/telegram-users.json`, JSON.stringify(users, null, 2))
    } catch (error) {
        console.log('Some error occured while saving users: ' + error);
    }
}

module.exports = telegramBot;