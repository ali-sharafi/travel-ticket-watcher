"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ghasedak = void 0;
const axios_1 = __importDefault(require("axios"));
const moment_jalaali_1 = __importDefault(require("moment-jalaali"));
const baseEntity_1 = __importDefault(require("../infrustructure/baseEntity"));
const telegramNotif_1 = __importDefault(require("../notifications/telegramNotif"));
const enums_1 = require("../utils/enums");
const logger_1 = __importDefault(require("../utils/logger"));
const tools_1 = require("../utils/tools");
class Ghasedak extends baseEntity_1.default {
    constructor() {
        super();
        this.BASE_URI = 'https://ghasedak24.com/search';
    }
    handle(travels) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readCities();
            for (let i = 0; i < travels.length; i++) {
                const travel = travels[i];
                this.addTravelAttributes(travel);
                (0, logger_1.default)(`Going to check travel ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at} at ghasedak`, 'ghasedak');
                this.checkTravel(travel);
                yield (0, tools_1.sleep)(1000 * 60 * 2);
            }
        });
    }
    checkTravel(travel) {
        switch (travel.type) {
            case enums_1.TravelTypes.AIRPLAN:
                this.getAirPlanTravels(travel);
                break;
            // case TravelTypes.TRAIN:
            //     this.getTrainTravels(travel);
            //     break;
            default:
                break;
        }
    }
    getTrainTravels(travel) {
        return __awaiter(this, void 0, void 0, function* () {
            let tickets = yield this.getTrainTrips();
            if (tickets && tickets.data.departure.length > 0) {
                let payload = {
                    message: `Train Ticket found: ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at}`,
                    link: `https://ghasedak24.com/search/train/${travel.origin_code}-${travel.destination_code}/${(0, moment_jalaali_1.default)(travel.date_at).format('jYYYY-jMM-jDD')}/1-0-0`
                };
                this.notify(payload);
            }
            else
                (0, logger_1.default)(`There is not any trips for train travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at ghasedak`, 'ghasedak');
        });
    }
    getTrainTrips() {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            res = yield axios_1.default.get(this.BASE_URI + '/search_train')
                .catch((err) => {
                console.log('Some error occured while get ghasedak train trips: ' + err.message);
            });
            if (res && res.data)
                return JSON.parse(res.data.data);
            return null;
        });
    }
    getAirPlanTravels(travel) {
        return __awaiter(this, void 0, void 0, function* () {
            let tickets = yield this.getAirPlanTrips(travel);
            if (tickets.length > 0) {
                let payload = {
                    message: `Ticket found: ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at}`,
                    link: `https://ghasedak24.com/search/flight/${travel.origin_code}-${travel.destination_code}/${(0, moment_jalaali_1.default)(travel.date_at).format('jYYYY-jMM-jDD')}/1-0-0`
                };
                this.notify(payload);
            }
            else
                (0, logger_1.default)(`There is not any trips for travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at ghasedak`, 'ghasedak');
        });
    }
    getAirPlanTrips(travel) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            res = yield axios_1.default.post(`${this.BASE_URI}/ajax_flight`, {
                "route": `${travel.origin_code}-${travel.destination_code}`,
                "date": (0, moment_jalaali_1.default)(travel.date_at).format('jYYYY-jMM-jDD'),
                "number": "1-0-0"
            })
                .catch((err) => {
                console.log('Some error occured while get flightio trips: ' + err.message);
            });
            if (res && res.data)
                return res.data.search.flights;
            return [];
        });
    }
    notify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = payload.message + '\n';
            message += `<a href="${payload.link}">Link</a>`;
            yield (0, telegramNotif_1.default)(message);
            (0, logger_1.default)(`Notification sent for ${payload.message}`, 'ghasedak');
        });
    }
}
exports.Ghasedak = Ghasedak;
