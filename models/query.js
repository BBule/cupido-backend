"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let querySchema = new Schema({
    body: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviewed: { type: Boolean, default: false }
});

module.exports = mongoose.model("query", query);
