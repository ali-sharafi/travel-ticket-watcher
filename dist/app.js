"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/config");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const fs_1 = __importDefault(require("fs"));
const body_parser_1 = __importDefault(require("body-parser"));
const travelController_1 = require("./controllers/travelController");
const logger_1 = __importDefault(require("./utils/logger"));
const traveller = new travelController_1.TravelController();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use('/api', routes_1.default);
if (!fs_1.default.existsSync(__dirname + '/storage')) {
    fs_1.default.mkdir(__dirname + '/storage', (err) => {
        if (err)
            (0, logger_1.default)('Some error occure while create storage directory: ' + err.message);
    });
}
if (!fs_1.default.existsSync(__dirname + '/logs')) {
    fs_1.default.mkdir(__dirname + '/logs', (err) => {
        if (err)
            (0, logger_1.default)('Some error occure while create logs directory: ' + err.message);
    });
}
traveller.read();
setInterval(() => {
    traveller.read();
}, 1000 * 60 * 5); //Every 10 minutes
app.use((err, req, res, next) => {
    if (err)
        res.status(400).send({ message: err.message });
    else
        next();
});
console.info('App is running on port 3000...');
app.listen(3000);
