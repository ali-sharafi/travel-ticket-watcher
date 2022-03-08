import Travel from "../models/travel";
import { TicketNotification } from '../types/ticketNotificationType';

export interface TravelInterface {
    handle(travels: Travel[]): void;
    notify(payload: TicketNotification): void;
}