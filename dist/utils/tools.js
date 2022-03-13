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
exports.getDateTime = exports.getDate = exports.sleep = void 0;
const moment_jalaali_1 = __importDefault(require("moment-jalaali"));
const sleep = (millis) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => setTimeout(resolve, millis));
});
exports.sleep = sleep;
const getDate = () => {
    return (0, moment_jalaali_1.default)().format('YYYY-MM-DD');
};
exports.getDate = getDate;
const getDateTime = () => {
    return (0, moment_jalaali_1.default)().format('YYYY-MM-DD HH:mm:ss');
};
exports.getDateTime = getDateTime;
