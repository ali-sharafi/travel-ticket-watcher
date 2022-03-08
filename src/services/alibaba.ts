import axios, { AxiosError, AxiosResponse } from "axios";
import { TravelInterface } from "../contract/travelInterface";
import BaseEntity from "../infrustructure/baseEntity";
import City from "../models/city";
import Travel from "../models/travel";
import { AlibabaAvailableTokenRes, FinalResult, ResultType } from "../types/alibabaAvailableTokenRes";
import { TicketNotification } from "../types/ticketNotificationType";
import { TravelTypes } from "../utils/enums";
import { sleep } from "../utils/tools";

export class Alibaba extends BaseEntity implements TravelInterface {
    declare BASE_URI: string;

    constructor() {
        super();
        this.BASE_URI = 'https://ws.alibaba.ir/api/v1';
    }

    async handle(travels: Travel[]): Promise<void> {

        for (let i = 0; i < travels.length; i++) {
            const travel = travels[i];
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
                    message: `Ticket found: ${this.getCityByID(travel.origin)?.name} To ${this.getCityByID(travel.destination)?.name} for ${travel.date_at}`,
                    link: `https://www.alibaba.ir/flights/${this.getCityByID(travel.origin)?.code}-${this.getCityByID(travel.destination)?.name}?adult=1&child=0&infant=0&departing=${travel.date_at}`
                }

                this.notify(payload);
            }
        }
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

    notify(payload: TicketNotification): void {

    }
}