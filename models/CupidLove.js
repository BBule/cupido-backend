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
    Sale:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Saleslist"
        }
    },
    earned:{
        type:Boolean,
        default:false
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
            ref: "User"//should be changed when game introduced
        }
    },
    isOrder:Boolean,
    amount:Number,
    referralId:mongoose.Schema.Types.ObjectId

});

module.exports = mongoose.model("CupidLove", cupidLoveSchema);
