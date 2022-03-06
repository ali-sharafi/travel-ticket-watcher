import { Model } from "sequelize/types";
import { Notification } from '../types/notificationType';

export interface TravelInterface {
    handle(travels: Model[]): void;
    notify(payload: Notification): void;
}