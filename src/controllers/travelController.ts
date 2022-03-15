import { Request, Response } from "express";
import { TravelInterface } from "../contract/travelInterface";
import Travel from "../models/travel";
import { Alibaba } from "../services/alibaba";
import { Flightio } from "../services/flightio";
import { Ghasedak } from "../services/ghasedak";
import logger from "../utils/logger";

export class TravelController {
    declare services: TravelInterface[];

    constructor() {
        this.services = [new Alibaba(), new Flightio(), new Ghasedak()];
    }

    async read() {
        const travels = await Travel.findAll({
            where: {
                is_completed: false
            }
        });

        if (travels.length == 0) {
            logger('There is not any active travel...');
            return;
        }

        for (let i = 0; i < this.services.length; i++) {
            const service = this.services[i];
            service.handle(travels);
        }
    }

    static add(req: Request, res: Response) {
        Travel.create({
            type: req.body.type,
            origin: req.body.origin,
            destination: req.body.destination,
            date_at: req.body.date_at,
            max_price: req.body.max_price ?? null
        });

        res.send('success');
    }
}