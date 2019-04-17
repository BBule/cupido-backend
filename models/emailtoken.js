"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let emailtokenSchema = new Schema({
    token: String,
    timecreated: { type: Date, default: Date.now },
    used: Boolean
});

module.exports = mongoose.model("EmailToken", emailtokenSchema);
