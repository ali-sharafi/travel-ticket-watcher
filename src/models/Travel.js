const mongoose = require("mongoose");
const { TravelType } = require("../utils/types");

const TravelSchema = new mongoose.Schema({
    user_id: Number,
    type: {
        type: String,
        enum: [TravelType.AIRPLAN, TravelType.BUS, TravelType.TRAIN],
        default: TravelType.AIRPLAN
    },
    origin: Number,
    destination: Number,
    date_at: Date,
    is_completed: Boolean,
    max_price: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Travel", TravelSchema);