"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let faqSchema = new Schema({
    question: String,
    answer:String,
    category:String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviewed: { type: Boolean, default: false },
    timecreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("query", query);