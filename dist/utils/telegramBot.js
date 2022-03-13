"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const config_1 = require("../config/config");
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./logger"));
let proxyAgent;
var users = [];
let telegramBot;
if (config_1.PROXY_SERVER) {
    proxyAgent = (0, https_proxy_agent_1.default)(config_1.PROXY_SERVER);
}
if (config_1.BOT_TOKEN) {
    telegramBot = new node_telegram_bot_api_1.default(config_1.BOT_TOKEN, {
        polling: true,
        request: {
            url: 'api.telegram.org',
            agent: proxyAgent
        }
    });
    telegramBot.onText(/\/start/, (msg, match) => {
        if (telegramBot)
            telegramBot.sendMessage(msg.chat.id, 'Pls Enter your Password');
    });
    telegramBot.onText(new RegExp(config_1.TELEGRAM_PASSWORD), (msg, match) => {
        const chatId = msg.chat.id;
        users.push(chatId);
        users = [...new Set(users)];
        saveUsers();
        console.log('new telegram user registered: ', users);
        if (telegramBot)
            telegramBot.sendMessage(chatId, 'Done.');
    });
}
function saveUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        fs_1.default.writeFile(`${__dirname}/../storage/telegram-users.json`, JSON.stringify(users, null, 2), (err) => {
            if (err)
                (0, logger_1.default)('Some error occured while save new users: ' + err.message);
        });
    });
}
exports.default = telegramBot;
