const mongoose = require("mongoose");
const { TravelType } = require("../utils/types");

const TravelSchema = new mongoose.Schema({
    user_id: Integer,
    type: {
        type: String,
        enum: [TravelType.AIRPLAN, TravelType.BUS, TravelType.TRAIN],
        default: TravelType.AIRPLAN
    },
    origin:Integer,
    destination: Integer,
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Travel", TravelSchema);