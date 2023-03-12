const dotenv = require('dotenv');
dotenv.config();
require('./src/utils/telegramBot')
const cron = require('node-cron');
const logger = require('./src/utils/logger');
const db = require('./src/utils/db');
const { GetAll } = require('./src/reader');
const fs = require('fs');
const City = require('./src/models/City');
const Travel = require('./src/models/Travel');
const { TravelType } = require('./src/utils/types');

db.connect().then(() => {
    logger('Going to Update DB');
    updateCities();
})

cron.schedule(process.env.CRON_JOB_SCHEDULE, () => {
    logger('Cron job runs');
    GetAll().catch((e) => {
        logger(e)
    });
});

async function insertFakeData() {
    await Travel.deleteMany({});
    let origin = await City.findOne({ code: 'THR' });
    let destination = await City.findOne({ code: 'MHD' });
    await Travel.create({
        origin: origin.id,
        type: TravelType.TRAIN,
        destination: destination.id,
        date_at: '2023-03-23',
        is_completed: false
    })
    await Travel.create({
        origin: origin.id,
        type: TravelType.AIRPLANE,
        destination: destination.id,
        date_at: '2023-03-22',
        is_completed: false
    })
}

async function updateCities() {
    if ((await City.count()) == 0) {
        fs.readFile('./cities.json', 'utf-8', async (err, data) => {
            if (err) console.log(err);
            else {
                let cities = JSON.parse(data);
                await City.insertMany(cities);
            }
        })
    }
}