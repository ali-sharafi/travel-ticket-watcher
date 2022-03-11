import Travel from "../models/travel";
import { TicketNotification } from '../types/ticketNotificationType';

export interface TravelInterface {
    handle(travels: Travel[]): Promise<void>;
    notify(payload: TicketNotification): Promise<void>;
}