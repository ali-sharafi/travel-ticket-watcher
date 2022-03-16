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
const promises_1 = __importDefault(require("fs/promises"));
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
    telegramBot.onText(new RegExp(config_1.TELEGRAM_PASSWORD), (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        yield readUsers();
        users.push(chatId);
        users = [...new Set(users)];
        yield saveUsers();
        console.log('new telegram user registered: ', users);
        if (telegramBot)
            telegramBot.sendMessage(chatId, 'Done.');
    }));
}
function readUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield promises_1.default.readFile(`${__dirname}/../storage/telegram-users.json`, 'utf-8');
        users = JSON.parse(data);
    });
}
function saveUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield promises_1.default.writeFile(`${__dirname}/../storage/telegram-users.json`, JSON.stringify(users, null, 2));
        }
        catch (error) {
            console.log('Some error occured while saving users: ' + error);
        }
    });
}
exports.default = telegramBot;
