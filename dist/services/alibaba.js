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
exports.Alibaba = void 0;
const axios_1 = __importDefault(require("axios"));
const baseEntity_1 = __importDefault(require("../infrustructure/baseEntity"));
const telegramNotif_1 = __importDefault(require("../notifications/telegramNotif"));
const enums_1 = require("../utils/enums");
const logger_1 = __importDefault(require("../utils/logger"));
const tools_1 = require("../utils/tools");
const moment_jalaali_1 = __importDefault(require("moment-jalaali"));
class Alibaba extends baseEntity_1.default {
    constructor() {
        super();
        this.BASE_URI = 'https://ws.alibaba.ir/api';
    }
    handle(travels) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readCities();
            for (let i = 0; i < travels.length; i++) {
                const travel = travels[i];
                this.addTravelAttributes(travel);
                (0, logger_1.default)(`Going to check travel ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at} at alibab`, 'alibaba');
                this.checkTravel(travel);
                yield (0, tools_1.sleep)(1000 * 60 * 1);
            }
        });
    }
    checkTravel(travel) {
        switch (travel.type) {
            case enums_1.TravelTypes.AIRPLAN:
                this.getAirPlanTravels(travel);
                break;
            case enums_1.TravelTypes.TRAIN:
                this.getTrainTravels(travel);
                break;
            default:
                break;
        }
    }
    getAirPlanTravels(travel) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = yield this.getAvailableToken(travel);
            if (token) {
                let tickets = yield this.getAirPlanTrips(token);
                if (tickets.length > 0) {
                    let payload = {
                        message: `Airplane Ticket found: ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at}`,
                        link: `https://www.alibaba.ir/flights/${travel.origin_code}-${travel.destination_code}?adult=1&child=0&infant=0&departing=${(0, moment_jalaali_1.default)(travel.date_at).format('jYYYY-jMM-jDD')}`
                    };
                    this.notify(payload);
                }
                else
                    (0, logger_1.default)(`There is not any trips for airplane travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at alibaba`, 'alibaba');
            }
            else
                (0, logger_1.default)(`Token not available for airplane travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at alibaba`, 'alibaba');
        });
    }
    getAirPlanTrips(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            res = yield axios_1.default.get(this.BASE_URI + '/v1/flights/domestic/available/' + token)
                .catch((err) => {
                console.log('Some error occured while get alibaba trips: ' + err.message);
            });
            if (res && res.data)
                return res.data.result.departing;
            return [];
        });
    }
    getTrainTravels(travel) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = yield this.getAvailableTrainToken(travel);
            if (token) {
                let tickets = yield this.getTrainTrips(token);
                if (tickets.length > 0) {
                    let payload = {
                        message: `Train Ticket found: ${travel.origin_code} To ${travel.destination_code} for ${travel.date_at}`,
                        link: `https://www.alibaba.ir/train/${travel.origin_code}-${travel.destination_code}?adult=1&child=0&ticketType=Family&isExclusive=false&infant=0&departing=${(0, moment_jalaali_1.default)(travel.date_at).format('jYYYY-jMM-jDD')}`
                    };
                    this.notify(payload);
                }
                else
                    (0, logger_1.default)(`There is not any trips for train travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at alibaba`, 'alibaba');
            }
            else
                (0, logger_1.default)(`Token not available for train travel ${travel.origin_code}-${travel.destination_code}:${travel.date_at} at alibaba`, 'alibaba');
        });
    }
    getTrainTrips(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            res = yield axios_1.default.get(this.BASE_URI + '/v1/train/available/' + token)
                .catch((err) => {
                console.log('Some error occured while get alibaba train trips: ' + err.message);
            });
            if (res && res.data)
                return res.data.result.departing;
            return [];
        });
    }
    getAvailableToken(travel) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            res = yield axios_1.default.post(this.BASE_URI + '/v1/flights/domestic/available', {
                adult: 1,
                child: 0,
                infant: 0,
                departureDate: travel.date_at,
                destination: travel.destination_code,
                origin: travel.origin_code
            }).catch((err) => {
                console.log('Some error occured while get available token: ' + err.message);
            });
            if (res && res.data)
                return res.data.result.requestId;
            return null;
        });
    }
    getAvailableTrainToken(travel) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            res = yield axios_1.default.post(this.BASE_URI + '/v2/train/available', {
                passengerCount: 1,
                ticketType: "Family",
                isExclusiveCompartment: false,
                departureDate: travel.date_at,
                destination: travel.destination_code,
                origin: travel.origin_code
            }).catch((err) => {
                console.log('Some error occured while get available Train token in alibaba: ' + err.message);
            });
            if (res && res.data)
                return res.data.result.requestId;
            return null;
        });
    }
    notify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = payload.message + '\n';
            message += `<a href="${payload.link}">Link</a>`;
            yield (0, telegramNotif_1.default)(message);
            (0, logger_1.default)(`Notification sent for ${payload.message}`, 'alibaba');
        });
    }
}
exports.Alibaba = Alibaba;
