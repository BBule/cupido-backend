"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let cupidLoveSchema = new Schema({
    timecreated: { type: Date, default: Date.now },
    Order: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Orders"
        }
    },
    User: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    GameCard: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    isOrder:Boolean,
    amount:Number

});

module.exports = mongoose.model("CupidLove", cupidLoveSchema);
