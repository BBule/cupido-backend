"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let referralSchema = new Schema({
    code: String,
    createdBy:Schema.ObjectId,
    sale:Schema.ObjectId,
    usedBy:[Schema.ObjectId],
    timecreated: { type: Date, default: Date.now },
    // used: Boolean,
    amount:Number
});

// referralSchema.index({sale:1,usedBy:1},{unique:true});

module.exports = mongoose.model("Referral", referralSchema);
