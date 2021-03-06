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
const city_1 = __importDefault(require("../models/city"));
class BaseEntity {
    readCities() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cities = yield city_1.default.findAll();
        });
    }
    getCityByID(cityID) {
        return this.cities.find(item => item.id == cityID);
    }
    addTravelAttributes(travel) {
        let origin = this.getCityByID(travel.origin);
        let destination = this.getCityByID(travel.destination);
        travel.origin_code = origin.code;
        travel.destination_code = destination.code;
        travel.origin_name = destination.name;
        travel.destination_name = destination.name;
        return travel;
    }
}
exports.default = BaseEntity;
