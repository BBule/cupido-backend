"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let notificationsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sale: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "saleslist"
        },
        starttime: Date,
        endtime: Date,
        sale_buffer_time: Number
    },
    timecreated: { type: Date, default: Date.now },
    notificationbody: String
});

module.exports = mongoose.model("mynotifications", notificationsSchema);
