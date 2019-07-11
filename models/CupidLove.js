"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let cupidLoveSchema = new Schema({
    timecreated: { type: Date, default: Date.now },
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
    amount:{type:Number,default:0},
    referralId:mongoose.Schema.Types.ObjectId,
    balance:{type:Number,default:0},
    source:String

});

module.exports = mongoose.model("CupidLove", cupidLoveSchema);
