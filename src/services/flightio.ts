import axios, { AxiosError, AxiosResponse } from "axios";
import { TravelInterface } from "../contract/travelInterface";
import BaseEntity from "../infrustructure/baseEntity";
import City from "../models/city";
import travel from "../models/travel";
import telegramNotif from "../notifications/telegramNotif";
import { FinalResult, FlightioAvailableTokenRes } from "../types/flightioAvailableTokenRes";
import { TicketNotification } from "../types/ticketNotificationType";
import { TravelTypes } from "../utils/enums";
import logger from "../utils/logger";
import { sleep } from "../utils/tools";

export class Flightio extends BaseEntity implements TravelInterface {

    declare BASE_URI: string;

    constructor() {
        super();
        this.BASE_URI = 'https://flightio.com/FlightSearch';
    }

    async handle(travels: travel[]): Promise<void> {
        await this.readCities();

        for (let i = 0; i < travels.length; i++) {
            const travel = travels[i];

            this.addTravelAttributes(travel);
            logger(`Going to check travel ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at} at flightio`, 'flightio')
            this.checkTravel(travel);

            await sleep(1000 * 60 * 2);
        }
    }

    private async getAirPlanTravels(travel: travel) {
        let token: null | string = await this.getAvailableToken(travel);
        if (token) {
            let tickets = await this.getAirPlanTrips(token);
            if (tickets.length > 0) {
                let payload: TicketNotification = {
                    message: `Ticket found: ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at}`,
                    link: `https://flightio.com/flight/search/2/${travel.origin_code}-${travel.destination_code}/${travel.date_at}/1-0-0`
                }

                this.notify(payload);
            } else logger(`There is not any trips for travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at flightio`, 'flightio')
        } else logger(`Token not available for travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at flightio`, 'flightio')
    }

    private async getAirPlanTrips(token: string) {
        let res: void | AxiosResponse<FinalResult>;

        res = await axios.get(`${this.BASE_URI}?id=${token}&isReturnExtraInfo=false`)
            .catch((err: AxiosError) => {
                console.log('Some error occured while get flightio trips: ' + err.message);
            });

        if (res && res.data)
            return res.data.items;
        return [];
    }

    private async getAvailableToken(travel: travel): Promise<string | null> {
        let res: void | AxiosResponse<FlightioAvailableTokenRes>;
        res = await axios.post(this.BASE_URI, {
            "source": travel.origin_code,
            "dest": travel.destination_code,
            "sourceLabel": travel.origin_name,
            "destLabel": travel.destination_name,
            "depart": travel.date_at,
            "adult": 1,
            "child": 0,
            "infant": 0,
            "tripMode": 1,
            "flightType": 2,
            "errors": { "source": null, "dest": null, "depart": null, "return": null, "adult": null, "child": null, "infant": null }
        }).catch((err: AxiosError) => {
            console.log('Some error occured while get available token in flightio: ' + err.message);
        });

        if (res && res.data)
            return res.data.searchId;
        return null;
    }

    private checkTravel(travel: travel) {
        switch (travel.type) {
            case TravelTypes.AIRPLAN:
                this.getAirPlanTravels(travel);
                break;

            default:
                break;
        }
    }

    private addTravelAttributes(travel: travel) {
        let origin: City = this.getCityByID(travel.origin)!;
        let destination: City = this.getCityByID(travel.destination)!;
        travel.origin_code = origin.code;
        travel.destination_code = destination.code;
        travel.origin_name = destination.name;
        travel.destination_name = destination.name;
    }

    async notify(payload: TicketNotification): Promise<void> {
        let message = payload.message + '\n';
        message += `<a href="${payload.link}">Link</a>`
        await telegramNotif(message);
        logger(`Notification sent for ${payload.message}`, 'flightio');
    }
}