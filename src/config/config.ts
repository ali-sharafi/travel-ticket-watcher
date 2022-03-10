import 'dotenv/config';

const APP_MODE: string = process.env.APP_MODE!;
const DB_HOST: string = process.env.DB_HOST!;
const DB_NAME: string = process.env.DB_NAME!;
const DB_USERNAME: string = process.env.DB_USERNAME!;
const DB_PASSWORD: string = process.env.DB_PASSWORD!;
const BOT_TOKEN: string = process.env.BOT_TOKEN!;
const PROXY_SERVER: string | undefined = process.env.PROXY_SERVER;
const TELEGRAM_PASSWORD: string = process.env.TELEGRAM_PASSWORD!;


export {
    APP_MODE,
    DB_HOST,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    BOT_TOKEN,
    PROXY_SERVER,
    TELEGRAM_PASSWORD
}