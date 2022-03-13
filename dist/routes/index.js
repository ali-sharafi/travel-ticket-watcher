"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const travelController_1 = require("../controllers/travelController");
const express_validator_1 = require("express-validator");
const enums_1 = require("../utils/enums");
const router = (0, express_1.default)();
router.post('/travel', (0, express_validator_1.body)('origin').isNumeric(), (0, express_validator_1.body)('destination').isNumeric(), (0, express_validator_1.body)('date_at').isDate(), (0, express_validator_1.body)('type').isIn([enums_1.TravelTypes.AIRPLAN, enums_1.TravelTypes.BUS, enums_1.TravelTypes.TRAIN]), (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    travelController_1.TravelController.add(req, res);
});
exports.default = router;
