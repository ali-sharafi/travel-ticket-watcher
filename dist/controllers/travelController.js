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
exports.TravelController = void 0;
const travel_1 = __importDefault(require("../models/travel"));
const alibaba_1 = require("../services/alibaba");
const flightio_1 = require("../services/flightio");
const logger_1 = __importDefault(require("../utils/logger"));
class TravelController {
    constructor() {
        this.services = [new alibaba_1.Alibaba(), new flightio_1.Flightio()];
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const travels = yield travel_1.default.findAll({
                where: {
                    is_completed: false
                }
            });
            if (travels.length == 0) {
                (0, logger_1.default)('There is not any active travel...');
                return;
            }
            for (let i = 0; i < this.services.length; i++) {
                const service = this.services[i];
                service.handle(travels);
            }
        });
    }
    static add(req, res) {
        var _a;
        travel_1.default.create({
            type: req.body.type,
            origin: req.body.origin,
            destination: req.body.destination,
            date_at: req.body.date_at,
            max_price: (_a = req.body.max_price) !== null && _a !== void 0 ? _a : null
        });
        res.send('success');
    }
}
exports.TravelController = TravelController;
