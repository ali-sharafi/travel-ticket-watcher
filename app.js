const dotenv = require('dotenv');
dotenv.config();
const cron = require('node-cron');
const logger = require('./src/utils/logger');
const db = require('./src/utils/db');
const { GetAll } = require('./src/reader');
const fs = require('fs');
const City = require('./src/models/City');

db.connect().then(() => {
    logger('Going to Update DB');
    if (City.count() == 0) {
        fs.readFile('./cities.json', 'utf-8', (err, data) => {
            if (err) console.log(err);
            else {
                let cities = JSON.parse(data);
                City.insertMany(cities);
            }
        })
    }
})

cron.schedule(process.env.CRON_JOB_SCHEDULE, () => {
    logger('Cron job runs');
    GetAll().catch((e) => {
        logger(e)
    });
});