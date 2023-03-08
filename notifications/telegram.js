import telegramBot from "../utils/telegramBot";
import fs from "fs";
import logger from "../utils/logger";

module.exports = async (message) => {
    fs.readFile(__dirname + '/../storage/telegram-users.json', 'utf-8', (err, data) => {
        if (err) logger('some exception occured while read users: ' + err.message);
        else {
            let users = JSON.parse(data);
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (telegramBot)
                    telegramBot.sendMessage(user, message, {
                        parse_mode: 'HTML'
                    });
            }
        }
    })
}