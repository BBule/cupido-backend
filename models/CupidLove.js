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
    Game: {
        id: {
            type: mongoose.Schema.Types.ObjectId
        }
    },
    isOrder:Boolean,
    amount:Number,
    referralId:mongoose.Schema.Types.ObjectId,
    balance:Number,
    source:String

});

module.exports = mongoose.model("CupidLove", cupidLoveSchema);
