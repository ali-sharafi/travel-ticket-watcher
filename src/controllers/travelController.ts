import { Request, Response } from "express";
import Travel from "../models/travel";

export class TravelController {
    constructor() {

    }

    static handleAdd(req: Request, res: Response) {
        Travel.create({
            type: req.body.type,
            origin: req.body.origin,
            destination: req.body.destination,
            date_at: req.body.date_at,
            max_price: req.body.max_price ?? null
        });

        res.send('success');
    }

    add(from: Number, to: Number, date: Date) {

    }
}