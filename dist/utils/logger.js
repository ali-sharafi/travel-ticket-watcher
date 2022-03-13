"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const tools_1 = require("./tools");
const logger = (message, filename = '', showInConsole = true) => {
    const logText = `${(0, tools_1.getDateTime)()}     ` + message + '\r\n';
    if (showInConsole)
        console.log(logText);
    const file = `${__dirname}/../logs/${(0, tools_1.getDate)()}${filename ? '-' + filename : ''}.log`;
    fs_1.default.appendFile(file, logText, 'utf8', (error) => {
        if (error) {
            console.log((0, tools_1.getDateTime)() + ' -> ' + error);
        }
    });
};
exports.default = logger;
