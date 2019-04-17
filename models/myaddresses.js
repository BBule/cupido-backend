"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let addressesSchema = new Schema({
    User: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        useremail: String,
        contact: String,
        address: String,
        landmark: String,
        city: String,
        state: String,
        country: String
    },
    timecreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("myaddresses", addressesSchema);
