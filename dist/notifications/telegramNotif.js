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
const telegramBot_1 = __importDefault(require("../utils/telegramBot"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("../utils/logger"));
const telegramNotif = (message) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.readFile(__dirname + '/../storage/telegram-users.json', 'utf-8', (err, data) => {
        if (err)
            (0, logger_1.default)('some exception occured while read users: ' + err.message);
        else {
            let users = JSON.parse(data);
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (telegramBot_1.default)
                    telegramBot_1.default.sendMessage(user, message, {
                        parse_mode: 'HTML'
                    });
            }
        }
    });
});
exports.default = telegramNotif;
