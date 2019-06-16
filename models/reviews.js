"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let productReview = new Schema({
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
        }
    },
    timecreated: { type: Date, default: Date.now },
    rating: { type: Number, required: true },
    reviewbody: String,
    is_verified_buyer: { type: Boolean, default: false } // is the comment maker a buyer of the product
});

module.exports = mongoose.model("productReview", productReview);
