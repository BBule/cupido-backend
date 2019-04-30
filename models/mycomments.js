"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let mycommentsSchema = new Schema({
    User: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    Product: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
        },
        name: String,
        rating: Number
    },
    upvotes: {
        meta: [mongoose.Schema.Types.ObjectId],
        count: { type: Number, default: 0 }
    },
    downvotes: {
        meta: [mongoose.Schema.Types.ObjectId],
        count: { type: Number, default: 0 }
    },
    timecreated: { type: Date, default: Date.now },
    timeaccepted: Date,
    is_review: { type: Boolean, default: true }, // Other option being is discussion
    is_published: { type: Boolean, default: true }, // Other option being admin discretion
    commentbody: String,
    is_verified_buyer: { type: Boolean, default: false } // is the comment maker a buyer of the product
    // This can be implemented by seeing the user's orders, if a product is found it's good.
});

module.exports = mongoose.model("mycomments", mycommentsSchema);
