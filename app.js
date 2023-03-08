const dotenv = require('dotenv');
dotenv.config();
const cron = require('node-cron');
const logger = require('./src/utils/logger');
const db = require('./src/utils/db');
const { GetAll } = require('./src/reader');

db.connect().then(() => {
    logger('Going to Update DB');
    GetAll().then(() => {
        logger('Update DB was done');
    });
})

cron.schedule(process.env.CRON_JOB_SCHEDULE, () => {
    logger('Cron job runs');
    GetAll().catch((e) => {
        logger(e)
    });
});