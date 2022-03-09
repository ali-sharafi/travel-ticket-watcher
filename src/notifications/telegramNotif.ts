import telegramBot from "../utils/telegramBot";

const telegramNotif = async (message: string): Promise<void> => {
    const CHANNEL_ID = process.env.CHANNEL_ID;
    console.log('CHANNEL_ID: ', CHANNEL_ID);
    if (CHANNEL_ID && telegramBot)
        await telegramBot.sendMessage(CHANNEL_ID, message, {
            parse_mode: 'HTML',
            disable_notification: true
        })
}

export default telegramNotif;