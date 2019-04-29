"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let cupidLoveSchema = new Schema({
    timecreated: { type: Date, default: Date.now },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    gameCard: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    isOrder: Boolean,
    amount: Number
});

module.exports = mongoose.model("CupidLove", cupidLoveSchema);
