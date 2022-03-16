import axios, { AxiosError, AxiosResponse } from "axios";
import moment from "moment-jalaali";
import { TravelInterface } from "../contract/travelInterface";
import BaseEntity from "../infrustructure/baseEntity";
import Travel from "../models/travel";
import telegramNotif from "../notifications/telegramNotif";
import { TicketNotification } from "../types/ticketNotificationType";
import { TravelTypes } from "../utils/enums";
import logger from "../utils/logger";
import { sleep } from "../utils/tools";

export class Ghasedak extends BaseEntity implements TravelInterface {
    declare BASE_URI: string;

    constructor() {
        super();
        this.BASE_URI = 'https://ghasedak24.com/search';
    }

    async handle(travels: Travel[]): Promise<void> {
        await this.readCities();

        for (let i = 0; i < travels.length; i++) {
            const travel = travels[i];
            this.addTravelAttributes(travel);
            logger(`Going to check travel ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at} at ghasedak`, 'ghasedak')
            this.checkTravel(travel);

            await sleep(1000 * 60 * 2);
        }

    }

    private checkTravel(travel: Travel) {
        switch (travel.type) {
            case TravelTypes.AIRPLAN:
                this.getAirPlanTravels(travel);
                break;
            // case TravelTypes.TRAIN:
            //     this.getTrainTravels(travel);
            //     break;

            default:
                break;
        }
    }

    private async getTrainTravels(travel: Travel) {
        let tickets = await this.getTrainTrips();
        if (tickets && tickets.data.departure.length > 0) {
            let payload: TicketNotification = {
                message: `Train Ticket found: ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at}`,
                link: `https://ghasedak24.com/search/train/${travel.origin_code}-${travel.destination_code}/${moment(travel.date_at).format('jYYYY-jMM-jDD')}/1-0-0`
            }

            this.notify(payload);
        } else logger(`There is not any trips for train travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at ghasedak`, 'ghasedak')
    }

    private async getTrainTrips() {
        let res: void | AxiosResponse<{ data: string }>;

        res = await axios.get(this.BASE_URI + '/search_train')
            .catch((err: AxiosError) => {
                console.log('Some error occured while get ghasedak train trips: ' + err.message);
            });

        if (res && res.data)
            return JSON.parse(res.data.data) as { data: { departure: Array<object> } };
        return null;
    }

    private async getAirPlanTravels(travel: Travel) {
        let tickets = await this.getAirPlanTrips(travel);
        if (tickets.length > 0) {
            let payload: TicketNotification = {
                message: `Ticket found: ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at}`,
                link: `https://ghasedak24.com/search/flight/${travel.origin_code}-${travel.destination_code}/${moment(travel.date_at).format('jYYYY-jMM-jDD')}/1-0-0`
            }

            this.notify(payload);
        } else logger(`There is not any trips for travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at ghasedak`, 'ghasedak')
    }

    private async getAirPlanTrips(travel: Travel) {
        let res: void | AxiosResponse<{ search: { flights: Array<object> } }>;

        res = await axios.post(`${this.BASE_URI}/ajax_flight`, {
            "route": `${travel.origin_code}-${travel.destination_code}`,
            "date": moment(travel.date_at).format('jYYYY-jMM-jDD'),
            "number": "1-0-0"
        })
            .catch((err: AxiosError) => {
                console.log('Some error occured while get flightio trips: ' + err.message);
            });

        if (res && res.data)
            return res.data.search.flights;
        return [];
    }

    async notify(payload: TicketNotification): Promise<void> {
        let message = payload.message + '\n';
        message += `<a href="${payload.link}">Link</a>`
        await telegramNotif(message);
        logger(`Notification sent for ${payload.message}`, 'ghasedak');
    }
}