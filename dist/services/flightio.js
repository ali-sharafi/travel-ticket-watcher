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
exports.Flightio = void 0;
const axios_1 = __importDefault(require("axios"));
const baseEntity_1 = __importDefault(require("../infrustructure/baseEntity"));
const telegramNotif_1 = __importDefault(require("../notifications/telegramNotif"));
const enums_1 = require("../utils/enums");
const logger_1 = __importDefault(require("../utils/logger"));
const tools_1 = require("../utils/tools");
class Flightio extends baseEntity_1.default {
    constructor() {
        super();
        this.BASE_URI = 'https://flightio.com/FlightSearch';
    }
    handle(travels) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readCities();
            for (let i = 0; i < travels.length; i++) {
                const travel = travels[i];
                this.addTravelAttributes(travel);
                (0, logger_1.default)(`Going to check travel ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at} at flightio`, 'flightio');
                this.checkTravel(travel);
                yield (0, tools_1.sleep)(1000 * 60 * 1);
            }
        });
    }
    getAirPlanTravels(travel) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = yield this.getAvailableToken(travel);
            if (token) {
                let tickets = yield this.getAirPlanTrips(token);
                if (tickets.length > 0) {
                    let payload = {
                        message: `Ticket found: ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at}`,
                        link: `https://flightio.com/flight/search/2/${travel.origin_code}-${travel.destination_code}/${travel.date_at}/1-0-0`
                    };
                    this.notify(payload);
                }
                else
                    (0, logger_1.default)(`There is not any trips for travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at flightio`, 'flightio');
            }
            else
                (0, logger_1.default)(`Token not available for travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at flightio`, 'flightio');
        });
    }
    getAirPlanTrips(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            res = yield axios_1.default.get(`${this.BASE_URI}?id=${token}&isReturnExtraInfo=false`)
                .catch((err) => {
                console.log('Some error occured while get flightio trips: ' + err.message);
            });
            if (res && res.data)
                return res.data.items;
            return [];
        });
    }
    getAvailableToken(travel) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            res = yield axios_1.default.post(this.BASE_URI, {
                "source": travel.origin_code,
                "dest": travel.destination_code,
                "sourceLabel": travel.origin_name,
                "destLabel": travel.destination_name,
                "depart": travel.date_at,
                "adult": 1,
                "child": 0,
                "infant": 0,
                "tripMode": 1,
                "flightType": 2,
                "errors": { "source": null, "dest": null, "depart": null, "return": null, "adult": null, "child": null, "infant": null }
            }).catch((err) => {
                console.log('Some error occured while get available token in flightio: ' + err.message);
            });
            if (res && res.data)
                return res.data.searchId;
            return null;
        });
    }
    checkTravel(travel) {
        switch (travel.type) {
            case enums_1.TravelTypes.AIRPLAN:
                this.getAirPlanTravels(travel);
                break;
            default:
                break;
        }
    }
    addTravelAttributes(travel) {
        let origin = this.getCityByID(travel.origin);
        let destination = this.getCityByID(travel.destination);
        travel.origin_code = origin.code;
        travel.destination_code = destination.code;
        travel.origin_name = destination.name;
        travel.destination_name = destination.name;
    }
    notify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = payload.message + '\n';
            message += `<a href="${payload.link}">Link</a>`;
            yield (0, telegramNotif_1.default)(message);
            (0, logger_1.default)(`Notification sent for ${payload.message}`, 'flightio');
        });
    }
}
exports.Flightio = Flightio;
