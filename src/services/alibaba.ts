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

export class Alibaba extends BaseEntity implements TravelInterface {
    declare BASE_URI: string;

    constructor() {
        super();
        this.BASE_URI = 'https://ws.alibaba.ir/api/v1';
    }

    async handle(travels: Travel[]): Promise<void> {
        await this.readCities();
        for (let i = 0; i < travels.length; i++) {
            const travel = travels[i];
            travel.origin_name = this.getCityByID(travel.origin)!.code;
            travel.destination_name = this.getCityByID(travel.destination)!.code;

            logger(`Going to check travel ${travel.origin_name} To ${travel.destination_name} for ${travel.date_at}`, 'alibaba')
            this.checkTravel(travel);

            await sleep(1000 * 60 * 1);
        }

    }

    private checkTravel(travel: Travel) {
        switch (travel.type) {
            case TravelTypes.AIRPLAN:
                this.getAirPlanTravels(travel);
                break;
            case TravelTypes.TRAIN:
                this.getTrainTravels(travel);
                break;
            case TravelTypes.BUS:
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
                    message: `Ticket found: ${travel.origin_name} To ${travel.destination_name} for ${travel.date_at}`,
                    link: `https://www.alibaba.ir/flights/${travel.origin_name}-${travel.destination_name}?adult=1&child=0&infant=0&departing=${moment(travel.date_at).format('jYYYY-jMM-jDD')}`
                }

                this.notify(payload);
            } else logger(`There is not any trips for travel ${travel.origin_name}-${travel.destination_name}:${travel.date_at}`, 'alibaba')
        } else logger(`Token not available for travel ${travel.origin_name}-${travel.destination_name}:${travel.date_at}`, 'alibaba')
    }

    private async getAirPlanTrips(token: string): Promise<Array<object>> {
        let res: void | AxiosResponse<AlibabaAvailableTokenRes>;

        res = await axios.get(this.BASE_URI + '/flights/domestic/available/' + token)
            .catch((err: AxiosError) => {
                console.log('Some error occured while get alibaba trips: ' + err.message);
            });

        if (res && res.data)
            return (res.data.result as FinalResult).departing;
        return [];
    }

    private getBusTravels(travel: Travel) { }

    private getTrainTravels(travel: Travel) { }

    private async getAvailableToken(travel: Travel): Promise<string | null> {
        let res: void | AxiosResponse<AlibabaAvailableTokenRes>;
        res = await axios.post(this.BASE_URI + '/flights/domestic/available', {
            adult: 1,
            child: 0,
            infant: 0,
            departureDate: travel.date_at,
            destination: this.getCityByID(travel.destination)?.code,
            origin: this.getCityByID(travel.origin)?.code
        }).catch((err: AxiosError) => {
            console.log('Some error occured while get available token: ' + err.message);
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