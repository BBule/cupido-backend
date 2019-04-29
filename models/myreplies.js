"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let myrepliesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mycomments"
    },
    timecreated: { type: Date, default: Date.now },
    timeaccepted: Date,
    is_review: Boolean, // Other option being is discussion
    is_published: Boolean, // Other option being admin discretion
    replybody: String,
    is_verified_buyer: Boolean // is the reply maker a buyer of the product
    // This can be implemented by seeing the user's orders, if a product is found it's good.
});

module.exports = mongoose.model("myreplies", myrepliesSchema);
