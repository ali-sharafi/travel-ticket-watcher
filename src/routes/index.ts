import Router, { Request, Response } from 'express';
import { TravelController } from '../controllers/travelController';
import { body, validationResult } from 'express-validator';
import { TravelTypes } from '../utils/enums';

const router = Router();

router.post('/travel',
    body('origin').isNumeric(),
    body('destination').isNumeric(),
    body('date_at').isDate(),
    body('type').isIn([TravelTypes.AIRPLAN, TravelTypes.BUS, TravelTypes.TRAIN]),
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        TravelController.add(req, res);
    });

export default router;