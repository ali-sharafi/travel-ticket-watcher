const { default: axios } = require("axios");
const logger = require("../utils/logger");
const { TravelType } = require("../utils/types");
const telegram = require('../notifications/telegram');
const momentj = require('moment-jalaali');
const moment = require('moment');
const BASE_URI = 'https://ws.alibaba.ir/api';

module.exports = async (travel) => {
    logger(`Going to check travel ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at} at alibab`);

    switch (travel.type) {
        case TravelType.AIRPLAN:
            getAirPlanTravels(travel);
            break;
        case TravelType.TRAIN:
            getTrainTravels(travel);
            break;

        default:
            break;
    }
}

async function getAirPlanTravels(travel) {
    let token = await getAvailableAirplanToken(travel);
    if (token) {
        let tickets = await getAirPlanTrips(token);
        if (tickets.length > 0) {
            tickets.forEach(ticket => {
                let payload = {
                    message: `Airplane Ticket found: ${travel.origin_code} To ${travel.destination_code} for ${ticket.leaveDateTime}`,
                    link: `https://www.alibaba.ir/flights/${travel.origin_code}-${travel.destination_code}?adult=1&child=0&infant=0&departing=${momentj(travel.date_at).format('jYYYY-jMM-jDD')}`,
                    travelId: travel.id
                }

                notify(payload);
            });

        } else logger(`There is not any trips for airplane travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at alibaba`, 'alibaba')
    } else logger(`Token not available for airplane travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at alibaba`, 'alibaba')
}

async function getAirPlanTrips(token) {
    let res = await axios.get(BASE_URI + '/v1/flights/domestic/available/' + token)
        .catch((err) => {
            console.log('Some error occured while get alibaba trips: ' + err.message);
        });

    if (res && res.data) {
        return res.data.result.departing.filter(item => item.seat > 0);
    }
    return [];
}

async function getAvailableAirplanToken(travel) {
    let res = await axios.post(BASE_URI + '/v1/flights/domestic/available', {
        adult: 1,
        child: 0,
        infant: 0,
        departureDate: moment(travel.date_at).format('YYYY-MM-DD'),
        destination: travel.destination_code,
        origin: travel.origin_code
    }).catch((err) => {
        console.log('Some error occured while get available token: ' + err.message);
    });

    if (res && res.data)
        return res.data.result.requestId;
    return null;
}

async function notify(payload) {
    await telegram(payload.message, payload.link, payload.travelId);
    logger(`Notification sent for ${payload.message}`, 'alibaba');
}