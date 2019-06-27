"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let myrepliesSchema = new Schema({
    User: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    Comment: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "mycomments"
        }
    },
    timecreated: { type: Date, default: Date.now },
    timeaccepted: Date,                                                                  //cbr
    is_review: Boolean, // Other option being is discussion                             //cbr
    is_published: Boolean, // Other option being admin discretion                       //cbr
    replybody: String,
    is_verified_buyer: Boolean // is the reply maker a buyer of the product
    // This can be implemented by seeing the user's orders, if a product is found it's good.
});

module.exports = mongoose.model("myreplies", myrepliesSchema);
