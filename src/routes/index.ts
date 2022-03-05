import Router from 'express';
import { TravelController } from '../controllers/travelController';

const router = Router();

router.post('/travel', TravelController.handleAdd);

export default router;