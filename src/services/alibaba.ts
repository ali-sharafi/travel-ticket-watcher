import { Model } from "sequelize/types";
import { TravelInterface } from "../contract/travelInterface";
import { Notification } from "../types/notificationType";
import { sleep } from "../utils/tools";

export class Alibaba implements TravelInterface {
    async handle(travels: Model<any, any>[]): Promise<void> {
        for (let i = 0; i < travels.length; i++) {
            const travel = travels[i];
            this.checkTravel(travel);

            await sleep(1000 * 60 * 1);
        }

    }

    private checkTravel(travel: Model) {
        let travels: Array<object>;
    }

    private getAirPlanTravels(travel: Model) { }

    private getBusTravels(travel: Model) { }

    private getTrainTravels(travel: Model) { }

    notify(payload: Notification): void {

    }
}