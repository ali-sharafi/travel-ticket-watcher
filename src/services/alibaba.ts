import axios, { AxiosError, AxiosResponse } from "axios";
import { TravelInterface } from "../contract/travelInterface";
import BaseEntity from "../infrustructure/baseEntity";
import Travel from "../models/travel";
import telegramNotif from "../notifications/telegramNotif";
import { AlibabaAvailableTokenRes, FinalResult, ResultType } from "../types/alibabaAvailableTokenRes";
import { TicketNotification } from "../types/ticketNotificationType";
import { TravelTypes } from "../utils/enums";
import logger from "../utils/logger";
import { sleep } from "../utils/tools";
import moment from 'moment-jalaali';
import City from "../models/city";

export class Alibaba extends BaseEntity implements TravelInterface {
    declare BASE_URI: string;

    constructor() {
        super();
        this.BASE_URI = 'https://ws.alibaba.ir/api';
    }

    async handle(travels: Travel[]): Promise<void> {
        await this.readCities();
        for (let i = 0; i < travels.length; i++) {
            const travel = travels[i];

            this.addTravelAttributes(travel);
            logger(`Going to check travel ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at} at alibab`, 'alibaba')
            this.checkTravel(travel);

            await sleep(1000 * 60 * 1);
        }

    }

    private addTravelAttributes(travel: Travel) {
        let origin: City = this.getCityByID(travel.origin)!;
        let destination: City = this.getCityByID(travel.destination)!;
        travel.origin_code = origin.code;
        travel.destination_code = destination.code;
        travel.origin_name = destination.name;
        travel.destination_name = destination.name;
    }

    private checkTravel(travel: Travel) {
        switch (travel.type) {
            case TravelTypes.AIRPLAN:
                this.getAirPlanTravels(travel);
                break;
            case TravelTypes.TRAIN:
                this.getTrainTravels(travel);
                break;

            default:
                break;
        }
    }

    private async getAirPlanTravels(travel: Travel) {
        let token: null | string = await this.getAvailableToken(travel);
        if (token) {
            let tickets = await this.getAirPlanTrips(token);
            if (tickets.length > 0) {
                let payload: TicketNotification = {
                    message: `Airplane Ticket found: ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at}`,
                    link: `https://www.alibaba.ir/flights/${travel.origin_code}-${travel.destination_code}?adult=1&child=0&infant=0&departing=${moment(travel.date_at).format('jYYYY-jMM-jDD')}`
                }

                this.notify(payload);
            } else logger(`There is not any trips for airplane travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at alibaba`, 'alibaba')
        } else logger(`Token not available for airplane travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at alibaba`, 'alibaba')
    }

    private async getAirPlanTrips(token: string): Promise<Array<object>> {
        let res: void | AxiosResponse<AlibabaAvailableTokenRes>;

        res = await axios.get(this.BASE_URI + '/v1/flights/domestic/available/' + token)
            .catch((err: AxiosError) => {
                console.log('Some error occured while get alibaba trips: ' + err.message);
            });

        if (res && res.data)
            return (res.data.result as FinalResult).departing;
        return [];
    }

    private async getTrainTravels(travel: Travel) {
        let token = await this.getAvailableTrainToken(travel);
        if (token) {
            let tickets = await this.getTrainTrips(token);
            if (tickets.length > 0) {
                let payload: TicketNotification = {
                    message: `Train Ticket found: ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at}`,
                    link: `https://www.alibaba.ir/train/${travel.origin_code}-${travel.destination_code}?adult=1&child=0&ticketType=Family&isExclusive=false&infant=0&departing=${moment(travel.date_at).format('jYYYY-jMM-jDD')}`
                }

                this.notify(payload);
            } else logger(`There is not any trips for train travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at alibaba`, 'alibaba')
        } else logger(`Token not available for train travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at alibaba`, 'alibaba')
    }

    private async getTrainTrips(token: string) {
        let res: void | AxiosResponse<AlibabaAvailableTokenRes>;

        res = await axios.get(this.BASE_URI + '/v1/train/available/' + token)
            .catch((err: AxiosError) => {
                console.log('Some error occured while get alibaba train trips: ' + err.message);
            });

        if (res && res.data)
            return (res.data.result as FinalResult).departing;
        return [];
    }

    private async getAvailableToken(travel: Travel): Promise<string | null> {
        let res: void | AxiosResponse<AlibabaAvailableTokenRes>;
        res = await axios.post(this.BASE_URI + '/v1/flights/domestic/available', {
            adult: 1,
            child: 0,
            infant: 0,
            departureDate: travel.date_at,
            destination: travel.destination_code,
            origin: travel.origin_code
        }).catch((err: AxiosError) => {
            console.log('Some error occured while get available token: ' + err.message);
        });

        if (res && res.data)
            return (res.data.result as ResultType).requestId;
        return null;
    }

    private async getAvailableTrainToken(travel: Travel): Promise<string | null> {
        let res: void | AxiosResponse<AlibabaAvailableTokenRes>;
        res = await axios.post(this.BASE_URI + '/v2/train/available', {
            passengerCount: 1,
            ticketType: "Family",
            isExclusiveCompartment: false,
            departureDate: travel.date_at,
            destination: travel.destination_code,
            origin: travel.origin_code
        }).catch((err: AxiosError) => {
            console.log('Some error occured while get available Train token in alibaba: ' + err.message);
        });

        if (res && res.data)
            return (res.data.result as ResultType).requestId;
        return null;
    }

    async notify(payload: TicketNotification): Promise<void> {
        let message = payload.message + '\n';
        message += `<a href="${payload.link}">Link</a>`
        await telegramNotif(message);
        logger(`Notification sent for ${payload.message}`, 'alibaba');
    }
}