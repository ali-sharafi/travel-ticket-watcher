const telegramBot = require("../utils/telegramBot");
const fs = require("fs");
const logger = require("../utils/logger");

module.exports = async (message, url, travelId) => {
    fs.readFile(__dirname + '/../../storage/telegram-users.json', 'utf-8', (err, data) => {
        if (err) logger('some exception occured while read users: ' + err.message);
        else {
            let users = JSON.parse(data);
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (telegramBot)
                    telegramBot.sendMessage(user, message, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'View Ticket',
                                        url: url
                                    },
                                    {
                                        text: 'Complete',
                                        callback_data: `complete|${travelId}`
                                    },
                                ]
                            ]
                        },
                    });
            }
        }
    })
}