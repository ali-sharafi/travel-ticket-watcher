const mongoose = require("mongoose");
const { TravelType } = require("../utils/types");

const TravelSchema = new mongoose.Schema({
    user_id: String,
    type: {
        type: String,
        enum: [TravelType.AIRPLAN, TravelType.BUS, TravelType.TRAIN],
        default: TravelType.AIRPLAN
    },
    origin: String,
    destination: String,
    date_at: Date,
    is_completed: {
        type: Boolean,
        default: false
    },
    max_price: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Travel", TravelSchema);